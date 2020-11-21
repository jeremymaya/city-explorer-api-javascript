'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// API routes
app.get('/location', getLocation);
app.get('/weather', getWeather);

app.use('*', catchAll);

// Handler function for the GET /location route
// Returns an object which contains the necessary information for correct client rendering
function getLocation(request, response) {
    const city = request.query.city;
    const url = 'https://us1.locationiq.com/v1/search.php';
    const parameters = {
        key: process.env.GEOCODE_API_KEY,
        q: city,
        format: 'json',
        limit: 1
    };

    superagent
        .get(url)
        .query(parameters)
        .then(data => {
            const geoData = data.body[0];
            const location = new Location(city, geoData);
            response.status(200).send(location);
        })
        .catch(error => {
            handleInternalError(error);
        });
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
    const city = request.query;
    const url = 'https://api.weatherbit.io/v2.0/forecast/daily';
    const parameters = {
        key: process.env.WEATHER_API_KEY,
        lat: city.latitude,
        lon: city.longitude
    };

    superagent
        .get(url)
        .query(parameters)
        .then(data => {
            console.log(data.text);
            const forecast = weatherData.data.map(weather => new Weather(weather)); 
            response.status(200).send(forecast);
        })
        .catch(error => {
            handleInternalError(error);
        });
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

function handleInternalError(error) {
    console.log('ERROR', error);
    response.status(500).send('Sorry, something went wrong');
}

function catchAll(request, response) {
    response.status(404).send('404 Not Found D:');
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));