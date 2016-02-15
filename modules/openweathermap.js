'use strict';

var request = require('request');
var qs = require('querystring');
var debug = require('debug')('slack-weather:openweathermap');

var apiBase = 'http://api.openweathermap.org/data/2.5/';


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
		request.get(apiBase + 'weather?' + qs.stringify({
				zip: zip + ',us',
				appid: this.apiKey
			}),
			function handleRequest(err, res, body) {
				var error;
				if (!err && res.statusCode == 200) {
					var owmResponse = JSON.parse(body);
					if (!owmResponse.main || !owmResponse.main.temp) {
						error = new Error('Unknown response from weather service');
						error.status = 500;
						debug('Unknown Weather Service response: \n%s', body);
						return callback(error, null);
					}
					var response = {};
					response.city = owmResponse.name;
					response.tempC = owmResponse.main.temp - 273.15;
					response.tempF = (response.tempC * 1.8) + 32;
					response.description = owmResponse.weather.map(function(obj) {
						return obj.description;
					});
					return callback(null, response);
				} else if (!err) {
					error = new Error('Error from weather service');
					error.status = 500;
					debug('Weather Service error: \n%s', body);
					return callback(error, null);
				} else {
					return callback(err, null);
				}
			});
	};

	this.getForecastByZip = function(zip, callback) {
		var key = this.apiKey;
		//use zip call to get city name
		this.getWeatherByZip(zip, function(err, zipResponse) {
			if (err) {
				return callback(err, null);
			} else {
				request.get(apiBase + 'forecast/daily?' + qs.stringify({
						cnt: 5,
						q: zipResponse.city + ',us',
						appid: key
					}),
					function handleRequest(err, res, body) {
						var error;
						if (!err && res.statusCode == 200) {
							var owmResponse = JSON.parse(body);
							if (!owmResponse.list ) {
								error = new Error('Unknown response from weather service');
								error.status = 500;
								debug('Unknown Forecast Service response: \n%s', body);
								return callback(error, null);
							}
							var response = {};
							response.city = zipResponse.city;
							response.forecast = owmResponse.list.map(function(obj) {
								var item  = {
									timestamp: obj.dt,
									lowTempC: obj.temp.min - 273.15,
									highTempC: obj.temp.max - 273.15,
									description: obj.weather.map(function(w) {
										return w.description;
									})
								};
								item.lowTempF =(item.lowTempC * 1.8) + 32;
								item.highTempF =(item.highTempC * 1.8) + 32;
								return item;
							});
							return callback(null, response);
						} else if (!err) {
							error = new Error('Error from weather service');
							error.status = 500;
							debug('Weather Service error: \n%s', body);
							return callback(error, null);
						} else {
							return callback(err, null);
						}
					});
			}
		});
	};
}

module.exports = Weather;