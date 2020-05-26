# helplookforme API
[![Build Status](https://travis-ci.com/georgeben/Report-Missing-People-API.svg?token=sHUzxzZj1t8c6d7fKgWE&branch=production)](https://travis-ci.com/georgeben/Report-Missing-People-API)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Report cases of missing people quickly. Get alerts of people that get missing in your area. API for [helplookforme](https://helplookforme)

## API Documentation
View the documentation on how to use this API [here](https://documenter.getpostman.com/view/5935573/SWLmZ5FV?version=latest)

## Technologies
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

## Set up

### Using docker
- Clone this repository
- Install Docker on your machine
- `cd` into the repository
- RUN `export REDIS_PASSWORD=anypasswordyouwant`
- Create a .env file in the root directory of the project. A .env file stores sensitive credentials needed to run this project. After creating a .env file, copy the content of the .env.sample file and add the corresponding values.
After creating a .env file, copy the content of the .env.sample file and add the corresponding values. For more information about how to do this, view the section about Setting up .env variables below
- RUN `docker-compose up`. Make sure you have a stable internet connection.
- :tada: That's it! View app on http://localhost:3000  


### Manual setup
Before setting up this project on your local machine. Ensure you have the above listed technologies installed on your machine. If you dont have them
installed yet, read these guides on how to install them.
- [Installing Redis](https://redis.io/topics/quickstart)
- [Installing Nodejs](https://nodejs.org/en/download/)
- [Installing MongoDB](https://docs.mongodb.com/v3.2/installation/)

Once you have verified that the required techolologies are installed on your machine, follow the following steps to run this project.


1. #### Clone this repository
Open your Command Prompt / CMD (on windows) or Terminal on Mac and enter this command `git clone https://github.com/georgeben/Report-Missing-People-API.git`

2. #### Navigate to the repository
Navigate to the cloned repository by entering the command `cd Report-Missing-People-API`

3. #### Install project dependencies
Install the project's dependencies by running `npm install` or `yarn`

4. #### Set up services
This app depends on some services to run properly. Create an account for the following services.
- [Algolia](https://www.algolia.com/) - Algolia is used to provide real time search. 
- [Cloudinary](https://cloudinary.com/) - Cloudinary is used for storing uploaded images.
- [SendGrid](https://sendgrid.com/) - SendGrid is used for sending out emails and newsletters
- [Sentry](https://sentry.io)- Sentry is used for error reporting. 
- [New Relic](https://newrelic.com/) - Used for Application Performance Monitoring. To monitor the app's health in production.
- [Facebook Developer Account](https://developers.facebook.com/) - For Log in with Facebook functionality
- [Twitter Developer Account](https://developer.twitter.com/) - For Log in with Twitter, and for the twitter bot
- [Google Developer Account](https://console.developers.google.com/) - For Log in with google
- [Google recaptcha](https://www.google.com/recaptcha/intro/v3.html) - For preventing web robots from sending API requests.


5. #### Set up .env variables
Great! Now, create a .env file in the root directory of the project. A .env file stores sensitive credentials needed to run this project.
After creating a .env file, copy the content of the .env.sample file and add the corresponding values.

- NODE_ENV: This specifies the environment in which node is run e.g locally on your development machine, or in production.
- NEW_RELIC_LOG_ENABLED: Enables or disables agent specific logging. View [docs](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration)
- APP_ENV: The environment in which the app is run. It could be in development, staging, production, test.
- PORT: The port to listen to for incoming requests
- CLIENT_ID: Google client ID. View [docs](https://developers.google.com/identity/sign-in/web/sign-in)
- DEV_DBURL: The url of your MongoDB development database
- FACEBOOK_CLIENT_ID: Facebook client ID from your Facebook developer account
- FACEBOOK_CLIENT_SECRET: From your Facebook developer account
- TWITTER_CONSUMER_KEY: From your Twitter developer account. View [docs](https://developer.twitter.com/en/docs/basics/authentication/oauth-1-0a/obtaining-user-access-tokens)
- TWITTER_CONSUMER_SECRET: From your Twitter developer account.
- TWITTER_ACCESS_TOKEN: From your Twitter developer account.
- TWITTER_ACCESS_TOKEN_SECRET: From your Twitter developer account.
- JWT_SECRET: Any random string e.g sjkamnsdbamsbasdfksssuiqisdbas
- SENDGRID_APIKEY: Your sendgrid API key. View [docs](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key)
- CLOUDINARY_CLOUDNAME: From your cloudinary console. View [docs](https://cloudinary.com/documentation/how_to_integrate_cloudinary)
- CLOUDINARY_APIKEY: From your cloudinary console.
- CLOUDINARY_APISECRET:  From your cloudinary console.
- ALGOLIA_APPID: Your Algolia App ID. View [docs](https://www.algolia.com/doc/guides/getting-started/quick-start/tutorials/quick-start-with-the-api-client/javascript/?language=javascript)
- ALGOLIA_APIKEY: Your Algolia API key.
- BOT_CONSUMER_KEY: Consumer key for the twitter bot.
- BOT_CONSUMER_SECRET: Consumer key secret for the twitter bot.
- BOT_ACCESS_TOKEN: Access token for twitter bot.
- BOT_ACCESS_TOKEN_SECRET: Access token secret for twitter bot.
- CAPTCHA_SECRET: Captch secret from your Captcha dashboard
- CONTACT_EMAIL: Email to send messages from the contact us form.
- SENTRY_DSN: Sentry's Data Source Name. View [docs](https://docs.sentry.io/error-reporting/quickstart/?platform=node)

6. #### Run the app
Before you run the app, ensure your MongoDB database is running, and your redis server is running. Phew! Finally you can run the app by entering the command `node server.js`. You should
see the some logs informing you that the app is running.
Open another terminal window, navigate to the app's repository, and run the command `node worker.js` to start the workers.
And you are don......Wait wait, one more step 😄

7. #### Set up MongoDB indices.
MongoDB indices are required for geospatial queries. View [docs](https://docs.mongodb.com/manual/geospatial-queries/). To set up
an index, 
- Enter the mongo shell by running `mongo` in your terminal
- Switch to the database you created `use <dbname>`
- Run `db.cases.createIndex({ 'addressLastSeen.location': "2dsphere" })`

## And your done! :tada:

If you had any difficulty setting up, please create an issue so we can help you.

## Run tests
Run `npm test` to run tests

## Contributing
Your contributions no matter how small are welcome. You can create an issue for bugs and send in PRs for fixes. Read the Contributors.md file 
for detailed instructions on how you can contribute.
