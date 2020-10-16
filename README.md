# code-301-lab-06

Author: Kyungrae Kim

Endpoint: <https://city-explorer-api-javascript.herokuapp.com>

---

## Overview

For this lab assignment, we will convert a location entered by the user into a latitude and longitude, then use those values to request weather information for that location.

---

## Architecture

This application uses the following technologies:

* JavaScript
* Express
* Node.js
* Dotenv
* npm

---

## Getting Started

Clone this repository to your local machine:

```bash
https://github.com/jeremymaya/code-301-lab-06.git
```

Install the dependencies:

```bash
npm i
```

### Development Mode

Create a `.env` file:

```bash
touch .env
```

Populate the following environmental variables in the `.env` file:

```text
PORT=XXXX
```

Start the application in development mode with the following command:

```bash
node server.js
```

Test the functionality of the `/location` endpoint running at `localhost:3000` with the following command:

```bash
curl -X GET http://localhost:3000/location --data "city=lynwood"
```

The expected output of the above command is:

```bash
{"formatted_query":"Lynnwood, Snohomish County, Washington, USA","latitude":"47.8278656","longitude":"-122.3053932"}
```

Test the functionality of the `/weather` endpoint running at `localhost:3000` with the following command:

```bash
curl -X GET http://localhost:3000/weather --data "formatted_query=Lynnwood%2C%20Snohomish%20County%2C%20Washington%2C%20USA&latitude=47.8278656&longitude=-122.3053932&page=1"
```

The expected output of the above command is:

```bash
[{"forecast":"Few clouds","time":"Sun Apr 12 2020"},{"forecast":"Few clouds","time":"Mon Apr 13 2020"},{"forecast":"Scattered clouds","time":"Tue Apr 14 2020"},{"forecast":"Few clouds","time":"Wed Apr 15 2020"},{"forecast":"Broken clouds","time":"Thu Apr 16 2020"}]
```

### Production Mode

Create a new Heroku app by clicking `New`.

After the app has been created, go to the `Deploy` tab and select GitHub as `Deployment method`.

Connect the correct repository from GitHub and choose the right branch to deploy.

Click `Deploy Branch`.

Access the endpoint running at <https://APP_NAME.herokuapp.com>.

The endpoint deployed from this project is accessible at <https://city-explorer-api-javascript.herokuapp.com>

The above endpoint can be rendered at [City Explorer app's welcome page](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/).

---

## Credits

* [GitHub - Code Fellows 301 Demo](https://github.com/codefellows/seattle-301n19/blob/master/class-06/demo/server/server.js)
* [Medium - Package.json Vs Package-lock.json Vs Npm-shrinkwrap.json](https://medium.com/@hossam.hilal0/package-json-vs-package-lock-json-vs-npm-shrinkwrap-json-33fcddc1521a)
* [Express - Installing](https://expressjs.com/en/starter/installing.html)
* [Express - Hello world example](https://expressjs.com/en/starter/hello-world.html)
* [keycdn - Popular curl Examples](https://www.keycdn.com/support/popular-curl-examples)
