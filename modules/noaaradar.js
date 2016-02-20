'use strict';

var zipcodes = require('zipcodes');

var mapLookup = {
  AL: "http://radar.weather.gov/ridge/Conus/Loop/southmissvly_loop.gif",
  AK: "http://radar.weather.gov/ridge/Conus/Loop/NatLoop_Small.gif",
  AZ: "http://radar.weather.gov/ridge/Conus/Loop/southrockies_loop.gif",
  AR: "http://radar.weather.gov/ridge/Conus/Loop/southmissvly_loop.gif",
  CA: "http://radar.weather.gov/ridge/Conus/Loop/pacsouthwest_loop.gif",
  CO: "http://radar.weather.gov/ridge/Conus/Loop/northrockies_loop.gif",
  CT: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  DE: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  DC: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  FL: "http://radar.weather.gov/ridge/Conus/Loop/southeast_loop.gif",
  GA: "http://radar.weather.gov/ridge/Conus/Loop/southeast_loop.gif",
  HI: "http://radar.weather.gov/ridge/Conus/Loop/NatLoop_Small.gif",
  ID: "http://radar.weather.gov/ridge/Conus/Loop/pacnorthwest_loop.gif",
  IL: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  IN: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  IA: "http://radar.weather.gov/ridge/Conus/Loop/uppermissvly_loop.gif",
  KS: "http://radar.weather.gov/ridge/Conus/Loop/uppermissvly_loop.gif",
  KY: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  LA: "http://radar.weather.gov/ridge/Conus/Loop/southmissvly_loop.gif",
  ME: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  MD: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  MA: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  MI: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  MN: "http://radar.weather.gov/ridge/Conus/Loop/uppermissvly_loop.gif",
  MS: "http://radar.weather.gov/ridge/Conus/Loop/southmissvly_loop.gif",
  MO: "http://radar.weather.gov/ridge/Conus/Loop/uppermissvly_loop.gif",
  MT: "http://radar.weather.gov/ridge/Conus/Loop/northrockies_loop.gif",
  NE: "http://radar.weather.gov/ridge/Conus/Loop/uppermissvly_loop.gif",
  NV: "http://radar.weather.gov/ridge/Conus/Loop/pacsouthwest_loop.gif",
  NH: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  NJ: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  NM: "http://radar.weather.gov/ridge/Conus/Loop/southrockies_loop.gif",
  NY: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  NC: "http://radar.weather.gov/ridge/Conus/Loop/southeast_loop.gif",
  ND: "http://radar.weather.gov/ridge/Conus/Loop/uppermissvly_loop.gif",
  OH: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  OK: "http://radar.weather.gov/ridge/Conus/Loop/southplains_loop.gif",
  OR: "http://radar.weather.gov/ridge/Conus/Loop/pacnorthwest_loop.gif",
  PA: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  RI: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  SC: "http://radar.weather.gov/ridge/Conus/Loop/southeast_loop.gif",
  SD: "http://radar.weather.gov/ridge/Conus/Loop/uppermissvly_loop.gif",
  TN: "http://radar.weather.gov/ridge/Conus/Loop/southeast_loop.gif",
  TX: "http://radar.weather.gov/ridge/Conus/Loop/southplains_loop.gif",
  UT: "http://radar.weather.gov/ridge/Conus/Loop/northrockies_loop.gif",
  VT: "http://radar.weather.gov/ridge/Conus/Loop/northeast_loop.gif",
  VA: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  WA: "http://radar.weather.gov/ridge/Conus/Loop/pacnorthwest_loop.gif",
  WV: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  WI: "http://radar.weather.gov/ridge/Conus/Loop/centgrtlakes_loop.gif",
  WY: "http://radar.weather.gov/ridge/Conus/Loop/northrockies_loop.gif",
  NATL: "http://radar.weather.gov/ridge/Conus/Loop/NatLoop_Small.gif"
};

function Radar() {

  /*
   * If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly.
   */
  if (false === (this instanceof Radar)) {
    console.log('Warning: Radar constructor called without "new" operator');
    return new Radar();
  }

  this.getRadarByZip = function (zip, callback) {
    var lookup = zipcodes.lookup(zip);

    if (!lookup) {
      var error = new Error('Could not find zipcode');
      error.status = 404;
      callback(error, null);
    } else {
      var cachebuster = "?cb=" + Date.now();
      callback(null, {
        city: lookup.city,
        radarMap: mapLookup[lookup.state] ? mapLookup[lookup.state] + cachebuster : null
      });
    }
  };

  this.getNationalRadar = function (callback) {
    callback(null, {
        radarMap: mapLookup.NATL + "?cb=" + Date.now()
    });
  }
}

module.exports = Radar;