'use strict';

var Weather = require('../modules/openweathermap');
var Radar = require('../modules/accuweatherradar');
var express = require('express');
var util = require('util');
var moment = require('moment');
var router = express.Router();


//new Weather API using the key defaulted from the environment
var weather = new Weather();

var radar = new Radar();

/* current weather */
router.post('/weather', function(req, res, next) {
	var tokens = req.body.text.split(/\s+/);
	var zip = tokens[0];
	var fahrenheit = tokens.length <= 1 || tokens[1].trim().toLowerCase() === 'f';
	if (!zip || !isValidUSZip(zip.trim())) {
		res.json({
			text: "I'm sorry I didn't understand.  Please use a US zip"
		});
	} else {
		weather.getWeatherByZip(zip.trim(), function handleResponse(err, result) {
			if (err) {
				res.json({
					text: "I'm sorry I couldn't process your request.  Please try again later"
				});
			} else {
				res.json({
					response_type: "in_channel",
					text: util.format('Here\'s the weather in %s\n%s°%s %s',
						result.city,
						fahrenheit ? result.tempF.toFixed(1) : result.tempC.toFixed(1),
						fahrenheit ? 'F' : 'C',
						result.description.join(', '))
				});
			}
		});
	}

});

router.post('/forecast', function(req, res, next) {
	var tokens = req.body.text.split(/\s+/);
	var zip = tokens[0];
	var fahrenheit = tokens.length <= 1 || tokens[1].trim().toLowerCase() === 'f';
	if (!zip || !isValidUSZip(zip.trim())) {
		res.json({
			text: "I'm sorry I didn't understand.  Please use a US zip"
		});
	} else {
		weather.getForecastByZip(zip.trim(), function handleResponse(err, result) {
			if (err) {
				res.json({
					text: "I'm sorry I couldn't process your request.  Please try again later"
				});
			} else {
				var forecast = result.forecast.map(function(f) {
					return util.format('%s High %s°%s Low %s°%s %s',
						moment.unix(f.timestamp).format('M/D'),
						fahrenheit ? f.highTempF.toFixed(1) : f.highTempC.toFixed(1),
						fahrenheit ? 'F' : 'C',
						fahrenheit ? f.lowTempF.toFixed(1) : f.lowTempC.toFixed(1),
						fahrenheit ? 'F' : 'C',
						f.description.join(', ')
					);
				}).join('\n');
				res.json({
					response_type: "in_channel",
					text: util.format('Here\'s the upcoming weather in %s\n%s',
						result.city,
						forecast)
				});
			}
		});
	}

});

/* current radar */
router.post('/radar', function(req, res, next) {
	var tokens = req.body.text.split(/\s+/);
	var zip = tokens[0];
	if (!zip || !isValidUSZip(zip.trim())) {
		res.json({
			text: "I'm sorry I didn't understand.  Please use a US zip"
		});
	} else {
		radar.getRadarByZip(zip.trim(), function handleResponse(err, result) {
			if (err) {
				res.json({
					text: "I'm sorry I couldn't process your request.  Please try again later"
				});
			} else if (!result.radarMap) {
				res.json({
					text: util.format('I\'m sorry, I couldn\'t find a radar map for %s', result.city)
				});
			} else {
				res.json({
					response_type: "in_channel",
					text: util.format('Here\'s the radar for %s', result.city),
					attachments: [{
						title: util.format('Here\'s the radar for %s', result.city),
						pretext: util.format('Radar Map for %s <%s>', result.city, result.radarMap),
						image_url: result.radarMap,
						color: "#F35A00"
					}]
				});
			}
		});
	}

});

function isValidUSZip(zip) {
	return /^\d{5}(-\d{4})?$/.test(zip);
}

module.exports = router;