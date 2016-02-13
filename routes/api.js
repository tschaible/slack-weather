var Weather = require('../modules/openweathermap');
var express = require('express');
var util = require('util');
var router = express.Router();


//new Weather API using the key defaulted from the environment
var weather = new Weather();

/* GET home page. */
router.post('/weather', function(req, res, next) {
	var zip = req.body.text;
	if (!zip || !isValidUSZip(zip.trim())) {
		res.json({
			text: "I'm sorry I didn't understand.  Please use a US zip"
		});
	}
	weather.getWeatherByZip(zip.trim(), function handleResponse(err, result) {
		if (err) {
			res.json({
				text: "I'm sorry I couldn't process your request.  Please try again later"
			});
		} else {
			res.json({
				response_type: "in_channel",
				text: util.format('Here\'s the weather in %s\n%s°F %s',
					result.city,
					result.tempF.toFixed(1),
					result.description.join(', '))
			});
		}
	});

});

function isValidUSZip(zip) {
	return /^\d{5}(-\d{4})?$/.test(zip);
}

module.exports = router;