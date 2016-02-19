'use strict';

describe('accuweatherradar', function() {
  var radar = new require('../modules/accuweatherradar')();
  var assert = require('assert');
  describe('getRadarByZip', function() {
    it('gets the radar map for a zip', function(done) {
      radar.getRadarByZip('12345', function(err, res) {
        assert(!err);
        //verify data was looked up correctly
        assert.strictEqual(res.city, 'Schenectady');
        assert.ok(/http\:\/\/sirocco\.accuweather\.com\/nx_mosaic_640x480_public\/sir\/inmasirny_\.gif\?[0-1]+/.test(res.radarMap));
        //assert.strictEqual(res.radarMap, 'http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirny_.gif');
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
});
