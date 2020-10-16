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

// GET route which accepts a location search query
// Returns an object which contains the necessary information for correct client rendering
app.get('/location', (request, response) =>{
    let searchQuery = request.query.data;
    const geoData = require('./data/geo.json');
    const location = new Location(searchQuery, geoData);
  
    response.status(200).send(location);
})

// A constructor function that converts the search query to a latitude and longitude
function Location(searchQuery, geoData){
    this.search_query = searchQuery;
    this.formatted_query = geoData.results[0].formatted_address;
    this.latitude = geoData.results[0].geometry.location.lat;
    this.longitude = geoData.results[0].geometry.location.lng;
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));