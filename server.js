'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');

// Application setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// GET route which accepts a location search query and return lat and lng
// Returns an object which contains the necessary information for correct client rendering
app.get('/location', (request, response) =>{
    let searchQuery = request.query.data;
    const geoData = require('./data/geo.json');
    const location = new Location(searchQuery, geoData);
  
    response.status(200).send(location);
})

// GET route which returns daily weather forecast from the stored JSON
// Return an array of objects for each day of the response which contains the necessary information for correct client rendering
app.get('/weather', (response) => {
    const darkskyData = require('./data/darksky.json');
    const forecast = [];
    
    darkskyData.daily.data.forEach(obj => {
      let weather = new Weather(obj);
      forecast.push(weather);
    })
  
    response.status(200).send(forecast);
})

// A constructor function that converts the search query to a latitude and longitude
function Location(searchQuery, geoData){
    this.search_query = searchQuery;
    this.formatted_query = geoData.results[0].formatted_address;
    this.latitude = geoData.results[0].geometry.location.lat;
    this.longitude = geoData.results[0].geometry.location.lng;
}

// A constructor function that converts an object to a weather object
function Weather(obj){
    this.forecast = obj.summary;
    this.time = this.formattedDate(obj.time);
}

// A prototype that converts time into a date
Weather.prototype.formattedDate = function(time) {
    let date = new Date(time*1000);
    return date.toDateString();
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));