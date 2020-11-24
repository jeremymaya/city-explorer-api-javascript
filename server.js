'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');

// Postgres client setup
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// API routes
app.get('/', getIndex);
app.get('/location', getLocation);
app.get('/weather', getWeather);
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
        .then(result => result.rowCount ? response.status(200).json(result.rows[0]) : searchLocation(request, response))
        .catch(error => handleInternalError(request, response, error));
}

// Search for a city not in the database
// Returns an object containing city information from LocationIQ API
function searchLocation(request, response) {
    const parameters = {
        key: process.env.GEOCODE_API_KEY,
        q: request.query.city,
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
        .catch(error => handleInternalError(request, response, error));
}

// Saves the new city infromation to the database
function saveLocation(location) {
    const sql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
    const value = [location.search_query, location.formatted_query, location.latitude, location.longitude];
    
    client
        .query(sql, value)
        .catch(error => handleInternalError(error));
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
    const parameters = {
        key: process.env.WEATHER_API_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude
    };

    superagent
        .get('https://api.weatherbit.io/v2.0/forecast/daily')
        .query(parameters)
        .then(data => {
            const weatherData = data.body.data;
            const forecast = weatherData.map(weather => new Weather(weather)); 
            response.status(200).send(forecast);
        })
        .catch(error => handleInternalError(request, response, error));
}

// A constructor function that converts an object to a weather object
function Weather(obj) {
    this.forecast = obj.weather.description;
    this.time = this.formattedDate(obj.valid_date);
}

// A prototype that converts time into a date
Weather.prototype.formattedDate = function(valid_date) {
    let date = new Date(valid_date);
    return date.toDateString();
}

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
        .catch(error => handleInternalError(request, response, error));
}

// A constructor function that converts an object to a weather object
function Movie(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.average_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.image_url = obj.poster_path ? `https://image.tmdb.org/t/p/w500${obj.poster_path}` : 'https://via.placeholder.com/500x750';
    this.popularity = obj.popularity;
    this.released_on = obj.release_date;
}

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
        .catch(error => handleInternalError(request, response, error));
}

function Restaurant(obj) {
    this.name = obj.name;
    this.image_url = obj.image_url;
    this.price = obj.price;
    this.rating = obj.rating;
    this.url = obj.url;
}

// Handler function for the GET / route
function getIndex(request, response) {
    response.status(200).send('Pair this backend with: https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end');
}

// Handler function for internal errors
function handleInternalError(request, response, error) {
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
    .then(() => app.listen(PORT, () => console.log(`Endpoint: http://localhost:${PORT}`)))
    .catch(error => handleInternalError(error));
