'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');

// Application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// API routes
app.get('/location', handleLocation);
app.get('/weather', handleWeather);

app.use('*', catchAll);

// Handler function for the GET /location route
// Returns an object which contains the necessary information for correct client rendering
function handleLocation(request, response) {
    try {
        const geoData = require('./data/geo.json');
        const city = request.query.data;
        const location = new Location(city, geoData);
      
        response.status(200).send(location);
    }
    catch(error) {
        handleInternalError(error)
    }
}

// A constructor function that converts the search query to a latitude and longitude
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

// Handler function for the GET /weather route
// Return an array of objects for each day of the response which contains the necessary information for correct client rendering
function handleWeather(request, response) {
    try {
        const weatherData = require('./data/weather.json');
        const forecast = [];
        
        weatherData.data.forEach(obj => {
          let weather = new Weather(obj);
          forecast.push(weather);
        })
      
        response.status(200).send(forecast);
    }
    catch(error) {
        handleInternalError(error);
    }
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