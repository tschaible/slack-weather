'use strict';

describe('noaaradar', function() {
  var radar = new require('../modules/noaaradar')();
  var assert = require('assert');
  describe('getRadarByZip', function() {
    it('gets the radar map for a zip', function(done) {
      radar.getRadarByZip('12345', function(err, res) {
        assert(!err);
        //verify data was looked up correctly
        assert.strictEqual(res.city, 'Schenectady');
        assert.strictEqual(res.radarMap, "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif");
        assert.ok(/^[0-9]+$/.test(res.cacheBuster));
        done();
      });
    });

    it('gets returns a null map when map can\'t be located', function(done) {
      radar.getRadarByZip('00921', function(err, res) {
        assert(!err);
        //verify data was looked up correctly
        assert.strictEqual(res.city, 'San Juan');
        assert.strictEqual(res.radarMap, null);
        done();
      });
    });


    it('returns error on bad zip', function(done) {
      radar.getRadarByZip('0000', function(err) {
        assert(err);
        //verify data was looked up correctly
        assert.strictEqual(err.status, 404);
        assert.strictEqual(err.message, 'Could not find zipcode');
        done();
      });
    });
  });

  describe('getNationalRadar', function () {
    it('gets the national weather map', function(done) {
      radar.getNationalRadar(function (err, res) {
        assert(!err);
        //verify data was looked up correctly
        assert.strictEqual(res.radarMap, "http://radar.weather.gov/ridge/Conus/Loop/NatLoop_Small.gif");
        assert.ok(/^[0-9]+$/.test(res.cacheBuster));
        done();
      });
    });
  });
});