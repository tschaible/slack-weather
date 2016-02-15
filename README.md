# slack-weather

[![Build Status](https://travis-ci.org/tschaible/slack-weather.svg?branch=master)](http://travis-ci.org/tschaible/slack-weather?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/tschaible/slack-weather/badge.svg?branch=master)](https://coveralls.io/github/tschaible/slack-weather?branch=master)

slack-weather is a node.js REST server which can be used to back slack custom slash weather and forecast commands that utilize the openweathermap.org API and other sources.

In other words, within slack ... type `/weather 12345` to get the weather at zip code 12345, type `/forecast 12345` to get the 5 day forecast at zip code 12345 


##The Commands

###/weather zipcode [C/F]
Get the current weather for a `zipcode` and optionally specify C or F

Source: openweathermap.org

###/forecast zipcode [C/F]
Get the 5-day forecast for a `zipcode` and optionally specify C or F

Source: openweathermap.org

###/radar zipcode
Get a radar gif attachment for `zipcode`

Source: accuweather.com

## Running the Server
```
OPENWEATHERMAP_API_KEY=[apiKey] npm start
```
where `[apiKey]` is a valid openweathmap.org API key.  

The server will listen on all interfaces and port 3000 by default.



To specify an alternate, such as 'localhost' and port 8080, run as follows
```
OPENWEATHERMAP_API_KEY=[apiKey] PORT=8080 SERVER_HOST=localhost npm start
```
where `[apiKey]` is a valid openweathmap.org API key.  