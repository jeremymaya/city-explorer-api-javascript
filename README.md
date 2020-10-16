# code-301-lab-06

Author: Kyungrae Kim

Endpoint: <https://city-explorer-api-javascript.herokuapp.com>

---

## Overview

For this lab assignment, we will convert a location entered by the user into a latitude and longitude, then use those values to request weather information for that location.

---

## Architecture

This application uses the following technologies:

* HTML
* CSS
* JavaScript
* Express
* Node.js
* Dotenv
* npm

---

## Getting Started

Clone this repository to your local machine:

```bash
https://github.com/jeremymaya/code-301-lab-06.gitcut-string.git
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

Access the endpoint running at <http://localhost:3000>.

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

* [Medium - Package.json Vs Package-lock.json Vs Npm-shrinkwrap.json](https://medium.com/@hossam.hilal0/package-json-vs-package-lock-json-vs-npm-shrinkwrap-json-33fcddc1521a)
* [Express - Installing](https://expressjs.com/en/starter/installing.html)
* [Express - Hello world example](https://expressjs.com/en/starter/hello-world.html)
