# code-301-lab-06

Author: Kyungrae Kim

Backend Endpoint: <https://city-explorer-api-javascript.herokuapp.com>

---

## Overview

For this lab assignment, we will convert a location entered by the user into a latitude and longitude, then use those values to request weather information for that location.

---

## Architecture

This application uses the following technologies:

* JavaScript
* Node.js
* Dotenv
* Express
* Postgres
* npm

---

## APIs

* [LocationIQ](https://locationiq.com)
* [Weatherbit.io](https://www.weatherbit.io)
* [Hiking Project](https://www.hikingproject.com)
* [The Movie Database](https://developers.themoviedb.org)

---

## Getting Started

Clone this repository to your local machine:

```bash
https://github.com/jeremymaya/code-301-lab-06.git
```

Navigate to the location where you cloned the repository and install the dependencies:

```bash
npm install
```

### Development Mode

Create a `.env` file:

```bash
touch .env
```

Obtain API keys from the above [APIs](##%20APIs) websites and populate the following environmental variables in the `.env` file:

```text
PORT=XXXX
GEOCODE_API_KEY=API_KEY
WEATHER_API_KEY=API_KEY
TRAIL_API_KEY=API_KEY
MOVIE_API_KEY=API_KEY
YELP_API_KEY=API_KEY
DATABASE_URL=CONNECTION_STRING
```

Navigate to the [data](/data) folder and enter the following command to run the SQL script:

```bash

```

Start the application in development mode with the following command:

```bash
npm start
```

### Production Mode

Create a new Heroku app by clicking `New`.

After the app has been created, click `Resources` tab and add `Heroku Postgres`.

Click `Settings` tab and then click `Reveal Config Var` to add the following environmental variables:

```text
GEOCODE_API_KEY=API_KEY
WEATHER_API_KEY=API_KEY
TRAIL_API_KEY=API_KEY
MOVIE_API_KEY=API_KEY
YELP_API_KEY=API_KEY
```

Click `Deploy` tab and select GitHub as `Deployment method`.

Connect the correct repository from GitHub and choose the right branch to deploy.

Click `Deploy Branch`.

Access the endpoint running at <https://APP_NAME.herokuapp.com>.

The endpoint deployed from this project is accessible at <https://city-explorer-api-javascript.herokuapp.com>

The above endpoint can be rendered at [City Explorer app's welcome page](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/).

---

## Endpoints

### Location

| Method | EndPoint | Description |
|:-|:-|:-|
| GET | `/location` | |

Test the functionality of the `/location` endpoint running at `localhost:3000` with the following command:

```bash
curl -X GET 'http://localhost:3000/location?city=seattle'
```

```json
Sample Response of GET /location

{
    "id":1, (if retreived from the database)
    "search_query":"seattle",
    "formatted_query":"Seattle, WA, USA",
    "latitude":47.6062095,
    "longitude":-122.3320708
}
```

### Weather

| Method | EndPoint | Description |
|:-|:-|:-|
| GET | `/weather` | |

Test the functionality of the `/weather` endpoint running at `localhost:3000` with the following command:

```bash
curl -X GET 'http://localhost:3000/weather?search_query=seattle&formatted_query=Seattle%2C%20WA%2C%20USA&latitude=47.6062095&longitude=-122.3320708'
```

```json
Sample Response of GET /weather

[
    {
        "forecast":"Light rain",
        "time":"Mon Nov 23 2020"
    },
]
```

### Trails

| Method | EndPoint | Description |
|:-|:-|:-|
| GET | `/trails` | |

Test the functionality of the `/trails` endpoint running at `localhost:3000` with the following command:

```bash
curl -X GET 'http://localhost:3000/trails?search_query=seattle&formatted_query=Seattle%2C%20WA%2C%20USA&latitude=47.6062095&longitude=-122.3320708'
```

```json
Sample Response of GET /trails

[
    {
        "name":"Poo Poo Point via Chirico Trail",
        "location":"Issaquah, Washington",
        "length":3.9,
        "stars":4.3,
        "star_votes":68,
        "summary":"A great place for a picnic and watching paragliders!",
        "conditions":"Mostly Dry",
        "condition_date":"2020-10-16",
        "condition_time":"15:24:28"
    },
]
```

### Movies

| Method | EndPoint | Description |
|:-|:-|:-|
| GET | `/movies` | |

Test the functionality of the `/movies` endpoint running at `localhost:3000` with the following command:

```bash
curl -X GET 'http://localhost:3000/movies?search_query=seattle&formatted_query=Seattle%2C%20WA%2C%20USA&latitude=47.6062095&longitude=-122.3320708'
```

```json
Sample Response of GET /movies

[
    {
        "title":"Battle in Seattle",
        "overview":"Thousands of activists arrive in Seattle, Washington in masses to protest the WTO Ministerial Conference of 1999 (World Trade Organization). Although it began as a peaceful protest with a goal of stopping the WTO talks, it escalated into a full-scale riot and eventually, a State of Emergency that pitted protesters against the Seattle Police Department and the National Guard.",
        "average_votes":6.3,
        "total_votes":150,
        "image_url":"https://image.tmdb.org/t/p/w500/aLstoTtWQHEilt9HWdSOiMZfDr7.jpg",
        "popularity":11.135,
        "released_on":"2007-09-07"
    },
]
```

### Yelp

| Method | EndPoint | Description |
|:-|:-|:-|
| GET | `/yelp` | |

Test the functionality of the `/yelp` endpoint running at `localhost:3000` with the following command:

```bash
curl -X GET 'http://localhost:3000/yelp?search_query=seattle&formatted_query=Seattle%2C%20WA%2C%20USA&latitude=47.6062095&longitude=-122.3320708'
```

```bash
curl -X GET 'https://city-explorer-api-javascript.herokuapp.com/yelp?search_query=seattle&formatted_query=Seattle%2C%20WA%2C%20USA&latitude=47.6062095&longitude=-122.3320708'
```

```json
Sample Response of GET /yelp

[
    {
        "name":"The Pink Door",
        "image_url":"https://s3-media1.fl.yelpcdn.com/bphoto/gsBE8LPk4XJfXuo0F-zWeQ/o.jpg",
        "price":"$$",
        "rating":4.5,
        "url":"https://www.yelp.com/biz/the-pink-door-seattle-4?adjust_creative=WXXm1izyYGtXnWezzpxc_g&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WXXm1izyYGtXnWezzpxc_g"
    },
]
```

---

## Credits

* [GitHub - Code Fellows 301 Demo](https://github.com/codefellows/seattle-301n19/blob/master/class-06/demo/server/server.js)
* [Trello - City Explorer](https://trello.com/b/ZmD87LCC/city-explorer)
* [Medium - Package.json Vs Package-lock.json Vs Npm-shrinkwrap.json](https://medium.com/@hossam.hilal0/package-json-vs-package-lock-json-vs-npm-shrinkwrap-json-33fcddc1521a)
* [Express - Installing](https://expressjs.com/en/starter/installing.html)
* [Express - Hello world example](https://expressjs.com/en/starter/hello-world.html)
* [keycdn - Popular curl Examples](https://www.keycdn.com/support/popular-curl-examples)
* [Superagent Documentation](https://visionmedia.github.io/superagent/#request-basics)
* [LocationIQ API Documentation](https://locationiq.com/docs)
* [Weatherbit.io API Documentation](https://www.weatherbit.io/api)
* [Hiking Project API Documentation](https://www.hikingproject.com/data)
* [The Movie Database API Documentation](https://developers.themoviedb.org/3/getting-started/introduction)
* [Medium@kirtikau - How to add Swagger UI to existing Node js and Express.js project](https://medium.com/@kirtikau/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce)
