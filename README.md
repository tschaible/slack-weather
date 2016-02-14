# slack-weather

[![Build Status](https://travis-ci.org/tschaible/slack-weather.svg?branch=master)](http://travis-ci.org/tschaible/slack-weather?branch=master)

slack-weather is a node.js REST server which can be used to back slack custom slash weather and forecast commands that utilize the openweathermap.org API.

In other words, within slack ... type `/weather 12345` to get the weather at zip code 12345, type `/forecast 12345` to get the 5 day forecast at zip code 12345 