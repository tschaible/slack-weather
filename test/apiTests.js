'use strict';

describe('slack-weather api', function() {

  var app;
  var request = require('supertest');
  var mockery = require('mockery');

  var stubbedOWM = function Weather() {
    this.getWeatherByZip = function(zip, callback) {
      if (zip === '00000') {
        callback(new Error(), null);
      } else {
        callback(null, {
          city: "city",
          tempC: 0,
          tempF: 32,
          description: ["cloudy"]
        });
      }
    };
    this.getForecastByZip = function(zip, callback) {
      if (zip === '00001') {
        callback(new Error(), null);
      } else {
        callback(null, {
          city: "city",
          forecast: [{
            timestamp: 43200,
            lowTempC: 0,
            lowTempF: 32,
            highTempC: 100,
            highTempF: 212,
            description: ["boiling"]
          }]
        });
      }
    };
  };

  var stubbedRadar = function Radar() {
    this.getRadarByZip = function(zip, callback) {
      if (zip === '00000') {
        callback(new Error(), null);
      } else if (zip === '00001') {
        callback(null, {
          city: "city",
          radarMap: null
        });
      } else {
        callback(null, {
          city: "city",
          radarMap: "http://example.org"
        });
      }
    };
    this.getNationalRadar = function (callback) {
        callback(null, {
            radarMap: "http://example.org",
            cacheBuster: "1234"
        });
    };
  };

  before(function() {
    mockery.enable(); // Enable mockery at the start of your test suite
    mockery.warnOnUnregistered(false);
    mockery.registerMock('../modules/openweathermap', stubbedOWM);
    mockery.registerMock('../modules/accuweatherradar', stubbedRadar);
    mockery.registerMock('../modules/noaaradar', stubbedRadar);
    app = require('../app.js');
  });

  describe('POST /weather', function() {
    it('validates bad zip code', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: "badzip"
        })
        .expect(200, {
          text: "I'm sorry I didn't understand.  Please use a US zip"
        }, done);
    });

    it('validates empty zip code', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: ""
        })
        .expect(200, {
          text: "I'm sorry I didn't understand.  Please use a US zip"
        }, done);
    });

    it('gets temp in F by default', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: "12345"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the weather in city\n32.0°F cloudy"
        }, done);
    });

    it('gets temp in F by specification of F', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: "12345 F"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the weather in city\n32.0°F cloudy"
        }, done);
    });

    it('gets temp in F by specification of f', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: "12345   f"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the weather in city\n32.0°F cloudy"
        }, done);
    });

    it('gets temp in C by specification of C', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: "12345 C"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the weather in city\n0.0°C cloudy"
        }, done);
    });

    it('gets temp in C by specification of c', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: "12345 c"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the weather in city\n0.0°C cloudy"
        }, done);
    });

    it('notifies when weather service is down', function(done) {
      request(app).post('/v1/weather')
        .send({
          text: "00000"
        })
        .expect(200, {
          text: "I'm sorry I couldn't process your request.  Please try again later"
        }, done);
    });
  });

  describe('POST /forecast', function() {
    it('validates bad zip code', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: "badzip"
        })
        .expect(200, {
          text: "I'm sorry I didn't understand.  Please use a US zip"
        }, done);
    });

    it('validates empty zip code', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: ""
        })
        .expect(200, {
          text: "I'm sorry I didn't understand.  Please use a US zip"
        }, done);
    });

    it('gets forecast in F by default', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: "12345"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the upcoming weather in city\n1/1 High 212.0°F Low 32.0°F boiling"
        }, done);
    });

    it('gets forecast in F by specification of F', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: "12345 F"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the upcoming weather in city\n1/1 High 212.0°F Low 32.0°F boiling"
        }, done);
    });

    it('gets forecast in F by specification of f', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: "12345   f"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the upcoming weather in city\n1/1 High 212.0°F Low 32.0°F boiling"
        }, done);
    });

    it('gets forecast in C by specification of C', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: "12345 C"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the upcoming weather in city\n1/1 High 100.0°C Low 0.0°C boiling"
        }, done);
    });

    it('gets forecast in C by specification of c', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: "12345 c"
        })
        .expect(200, {
          response_type: "in_channel",
          text: "Here\'s the upcoming weather in city\n1/1 High 100.0°C Low 0.0°C boiling"
        }, done);
    });

    it('notifies when weather service is down', function(done) {
      request(app).post('/v1/forecast')
        .send({
          text: "00001"
        })
        .expect(200, {
          text: "I'm sorry I couldn't process your request.  Please try again later"
        }, done);
    });
  });

  describe('POST /radar', function() {
    it('validates bad zip code', function(done) {
      request(app).post('/v1/radar')
        .send({
          text: "badzip"
        })
        .expect(200, {
          text: "I'm sorry I didn't understand.  Please use a US zip"
        }, done);
    });

    it('gets national radar map if zip code is empty', function(done) {
      request(app).post('/v1/radar')
        .send({
          text: ""
        })
        .expect(200, {
          response_type: "in_channel",
          attachments: [{
            color: "#F35A00",
            image_url: "http://example.org?cb=1234",
            pretext: "National Radar Map <http://example.org>",
            title: "Here\'s the national radar map"
          }]
        }, done);
    });

    it('gets radar map', function(done) {
      request(app).post('/v1/radar')
        .send({
          text: "12345"
        })
        .expect(200, {
          response_type: "in_channel",
          attachments: [{
            color: "#F35A00",
            image_url: "http://example.org",
            pretext: "Radar Map for city <http://example.org>",
            title: "Here\'s the radar for city"
          }]
        }, done);
    });

    it('notifies when a radar map could not be found', function(done) {
      request(app).post('/v1/radar')
        .send({
          text: "00001"
        })
        .expect(200, {
          text: "I'm sorry, I couldn't find a radar map for city"
        }, done);
    });

    it('notifies when weather service is down', function(done) {
      request(app).post('/v1/radar')
        .send({
          text: "00000"
        })
        .expect(200, {
          text: "I'm sorry I couldn't process your request.  Please try again later"
        }, done);
    });

  });

  after(function() {
    mockery.disable(); // Disable Mockery after tests are completed
  });
});
