'use strict';

describe('openweathermaps', function() {
	var weather = new require('../modules/openweathermap')('KEY');
	var nock = require('nock');
	var assert = require('assert');
	describe('getWeatherByZip', function() {
		it('gets the current weather for a zip', function(done) {
			//mock a successful weather lookup
			nock('http://api.openweathermap.org')
				.get('/data/2.5/weather')
				.query({
					zip: "12345,us",
					appid: "KEY"
				})
				.reply('200', {
					name: 'city',
					main: {
						temp: 273.15
					},
					weather: [{
						description: 'cloudy'
					}, {
						description: 'drizzle'
					}]
				});
			weather.getWeatherByZip('12345', function(err, res) {
				assert(!err);
				//verify data was converted correctly
				assert.strictEqual(res.city, 'city');
				assert.strictEqual(res.tempC, 0);
				assert.strictEqual(res.tempF, 32.0);
				assert.deepEqual(res.description, ['cloudy', 'drizzle']);
				done();
			});
		});

		it('returns error on unsuccessful request', function(done) {
			//mock an unsuccesful lookup
			nock('http://api.openweathermap.org')
				.get('/data/2.5/weather')
				.query({
					zip: "12345,us",
					appid: "KEY"
				})
				.reply('400');
			weather.getWeatherByZip('12345', function(err, res) {
				//check a correct error was returned
				assert.strictEqual(err.message, 'Error from weather service');
				assert.strictEqual(err.status, 500)
				done();
			});
		});
	});

	describe('getForecasrByZip', function() {
		it('gets the current weather for a zip', function(done) {

			//mock a successful zip lookup (this happens first)
			nock('http://api.openweathermap.org')
				.get('/data/2.5/weather')
				.query({
					zip: "12345,us",
					appid: "KEY"
				})
				.reply('200', {
					name: 'city',
					main: {
						temp: 273.15
					},
					weather: [{
						description: 'cloudy'
					}, {
						description: 'drizzle'
					}]
				});
			//mock a successful 2-day forecast
			nock('http://api.openweathermap.org')
				.get('/data/2.5/forecast/daily')
				.query({
					cnt: 5,
					q: "city,us",
					appid: "KEY"
				})
				.reply('200', {
					list: [{
						dt: 0,
						temp: {
							min: 273.15,
							max: 373.15
						},
						weather: [{
							description: 'cloudy'
						}, {
							description: 'drizzle'
						}]
					}, {
						dt: 1,
						temp: {
							min: 273.15,
							max: 373.15
						},
						weather: [{
							description: 'drizzle'
						}, {
							description: 'cloudy'
						}]
					}]
				});

			weather.getForecastByZip('12345', function(err, res) {
				assert(!err);
				//check that data is converted correctly
				assert.deepEqual(res, {
					city: 'city',
					forecast: [{
						timestamp: 0,
						lowTempC: 0,
						highTempC: 100,
						lowTempF: 32,
						highTempF: 212,
						description: ["cloudy", "drizzle"]
					}, {
						timestamp: 1,
						lowTempC: 0,
						highTempC: 100,
						lowTempF: 32,
						highTempF: 212,
						description: ["drizzle", "cloudy"]
					}, ]
				});
				done();
			});
		});

		it('gets returns error on unsuccessful request', function(done) {
			//keep a successful zip lookup response
			nock('http://api.openweathermap.org')
				.get('/data/2.5/weather')
				.query({
					zip: "12345,us",
					appid: "KEY"
				})
				.reply('200', {
					name: 'city',
					main: {
						temp: 273.15
					},
					weather: [{
						description: 'cloudy'
					}, {
						description: 'drizzle'
					}]
				});
			//but fail the forecast lookup
			nock('http://api.openweathermap.org')
				.get('/data/2.5/forecast/daily')
				.query({
					cnt: 5,
					q: "city,us",
					appid: "KEY"
				})
				.reply('400');

			weather.getForecastByZip('12345', function(err, res) {
				//check a correct error was returned
				assert.strictEqual(err.message, 'Error from weather service');
				assert.strictEqual(err.status, 500)
				done();
			});
		});


	});
});