"use strict";

var request = require('request');
var qs = require('querystring');
var debug = require('debug')('slack-weather:openweathermap');

var apiBase = 'http://api.openweathermap.org/data/2.5/weather'


function Weather(apiKey) {

	/*
	 * If this constructor is called without the "new" operator, "this" points
	 * to the global object. Log a warning and call it correctly.
	 */
	if (false === (this instanceof Weather)) {
		console.log('Warning: Weather constructor called without "new" operator');
		return new Weather(apiKey);
	}
	this.apiKey = apiKey || process.env.OPENWEATHERMAP_API_KEY;

	this.getWeatherByZip = function(zip, callback) {
		request.get(apiBase + '?' + qs.stringify({
				zip: zip + ',us',
				appid: this.apiKey
			}),
			function handleRequest(err, res, body) {
				if ( !err && res.statusCode == 200 ) {
					var owmResponse = JSON.parse(body);
					if ( !owmResponse.main || !owmResponse.main.temp ) {
						var error = new Error('Unknown response from weather service');
						error.status = 500;
						debug('Unknown Weather Service response: \n%s',body);
						return callback(error, null);
					}
					var response = {};
					response.city = owmResponse.name;
					response.tempC = owmResponse.main.temp - 273.15;
					response.tempF = (response.tempC * 1.8) + 32;
					response.description = owmResponse.weather.map(function(obj){return obj.description});
					return callback(null,response);
				} else if ( !err ) {
					var error = new Error('Error from weather service');
					error.status = 500;
					debug('Weather Service error: \n%s',body);
					return callback(error, null);
				} else {
					return callback(err, null);
				}
			});
	};
}

module.exports = Weather;