'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

// Postgres Setup
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Application Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// Routes
app.get('/', getIndex);
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails)
app.get('/movies', getMovies);
app.get('/yelp', getRestaurants)
app.use('*', catchAll);

// Handler function for the GET /location route
// Returns an object containing city information from the database
function getLocation(request, response) {
    const city = request.query.city;
    const sql = `SELECT * FROM locations WHERE search_query=$1`;

    client
        .query(sql, [city])
        .then(result => result.rowCount ? response.status(200).json(result.rows[0]) : searchLocation(response, city))
        .catch(error => handleInternalError(response, error));
}

// Search for a city not in the database
// Returns an object containing city information from LocationIQ API
function searchLocation(response, city) {
    const parameters = {
        key: process.env.GEOCODE_API_KEY,
        q: city,
        format: 'json',
        limit: 1
    };

    superagent
        .get('https://us1.locationiq.com/v1/search.php')
        .query(parameters)
        .then(data => {
            const location = new Location(city, data.body[0]);
            saveLocation(location);
            response.status(200).send(location);
        })
        .catch(error => handleInternalError(response, error));
}

// Saves the new city infromation to the database
function saveLocation(location) {
    const sql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
    const value = [location.search_query, location.formatted_query, location.latitude, location.longitude];
    
    client
        .query(sql, value)
        .catch(error => handleInternalError(response, error));
}

// A constructor function that converts the search query to a latitude and longitude
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
}

// Handler function for the GET /weather route
// Return an array of objects for each day of the response which contains the necessary information for correct client rendering
function getWeather(request, response) {
    console.log(request);
    const parameters = {
        key: process.env.WEATHER_API_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude
    };

    superagent
        .get('https://api.weatherbit.io/v2.0/forecast/daily')
        .query(parameters)
        .then(data => {
            const forecast = data.body.data.map(weather => new Weather(weather)); 
            response.status(200).send(forecast);
        })
        .catch(error => handleInternalError(response, error));
}

// A constructor function that converts an object to a weather object
function Weather(weather) {
    this.forecast = weather.weather.description;
    this.time = this.formattedDate(weather.valid_date);
}

// A prototype that converts time into a date
Weather.prototype.formattedDate = function(valid_date) {
    let date = new Date(valid_date);
    return date.toDateString();
}

// Handler function for the GET /trails route
// Return an array of trail objects which contains the necessary information for correct client rendering
function getTrails(request, response) {
    const parameters = {
        key: process.env.TRAIL_API_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude
    };

    superagent
        .get('https://www.hikingproject.com/data/get-trails')
        .query(parameters)
        .then(data => {
            const trails = data.body.trails.map(trail => new Trail(trail)); 
            response.status(200).send(trails);
        })
        .catch(error => handleInternalError(response, error));
}

// A constructor function for trail
function Trail(trail) {
    this.name = trail.name;
    this.location = trail.location;
    this.length = trail.length;
    this.stars = trail.stars;
    this.star_votes = trail.starVotes;
    this.summary = trail.summary;
    this.trail_url = trail.trail_url;
    this.conditions = trail.conditionDetails;
    this.condition_date = trail.conditionDate.split(" ")[0];
    this.condition_time = trail.conditionDate.split(" ")[1];
}

// Handler function for the GET /movies route
// Return an array of movie objects which contains the necessary information for correct client rendering
function getMovies(request, response) {
    const parameters = {
        api_key: process.env.MOVIE_API_KEY,
        query: request.query.search_query,
        page: 1
    };

    superagent
        .get('https://api.themoviedb.org/3/search/movie')
        .query(parameters)
        .then(data => {
            const movies = data.body.results.map(movie => new Movie(movie)); 
            response.status(200).send(movies);
        })
        .catch(error => handleInternalError(response, error));
}

// A constructor function for movie object
function Movie(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750';
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
}

// Handler function for the GET /yelp route
// Return an array of restaurant objects which contains the necessary information for correct client rendering
function getRestaurants(request, response) {
    const paginate = 5;
    const page = request.query.page || 1;
    const start = ((page - 1) * paginate + 1);

    const parameters = {
        term: 'restaurants',
        latitude: request.query.latitude,
        longitude: request.query.longitude,
        limit: 5,
        offset: start
    };

    superagent
        .get('https://api.yelp.com/v3/businesses/search')
        .auth(process.env.YELP_API_KEY, { type: 'bearer' })
        .query(parameters)
        .then(data => {
            const restaurants = data.body.businesses.map(restaurant => new Restaurant(restaurant)); 
            response.status(200).send(restaurants);
        })
        .catch(error => handleInternalError(response, error));
}

// A constructor function for restaurant object
function Restaurant(restaurant) {
    this.name = restaurant.name;
    this.image_url = restaurant.image_url;
    this.price = restaurant.price;
    this.rating = restaurant.rating;
    this.url = restaurant.url;
}

// Handler function for the GET / route
function getIndex(request, response) {
    response.status(200).send('Pair this backend with: https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end');
}

// Handler function for internal errors
function handleInternalError(response, error) {
    console.log('ERROR', error);
    response.status(500).send('Sorry, something went wrong');
}

// Handler function for all other errors
function catchAll(request, response) {
    response.status(404).send('404 Not Found D:');
}

// Connect to Postgres then start the server
client
    .connect()
    .then(() => {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        app.listen(PORT, () => console.log(`Endpoint: http://localhost:${PORT}`));
    })
    .catch(error => handleInternalError(error));
