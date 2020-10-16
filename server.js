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

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));