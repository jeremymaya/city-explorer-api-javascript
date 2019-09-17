'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(cors());

/*
app.get('/location', (request, response) => {
  try{
    let searchQuery = request.query.data;
    const geoDataResults = require('./data/geo.json');
  
    const locations = new Location(searchQuery, geoDataResults);
  
    response.status(200).send(locations);
  }
  catch(err){
    console.error(err);
  }
})

function Location(searchQuery, geoDataResults){
  this.searchQuery = searchQuery;
  this.formatted_query = geoDataResults.results[0].formatted_address;
  this.latitude = geoDataResults.results[0].geometry.location.lat;
  this.longitude = geoDataResults.results[0].geometry.location.lng;
}
*/

app.get('/location', (request, response) =>{
  let searchQuery = request.query.data;
  const geoData = require('./data/geo.json');

  const location = new Location(searchQuery, geoData);

  console.log(location);
  response.status(200).send(location);
})

function Location(searchQuery, geoData){
  this.search_query = searchQuery;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}




app.listen(PORT, () => console.log(`listening on ${PORT}`));