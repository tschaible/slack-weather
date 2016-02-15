'use strict';

var zipcodes = require('zipcodes');

var mapLookup = {
  AL: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasiral_.gif",
  AK: "http://sirocco.accuweather.com/nx_mosaic_640x480c/re/inmareak_.gif",
  AZ: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasiraz_.gif",
  AR: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirar_.gif",
  CA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnv_.gif",
  CO: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirco_.gif",
  CT: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirct_.gif",
  DE: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirva_.gif",
  DC: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirva_.gif",
  FL: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirfl_.gif",
  GA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirga_.gif",
  HI: "http://sirocco.accuweather.com/nx_mosaic_640x480c/re/inmarehi_.gif",
  ID: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirid_.gif",
  IL: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasiril_.gif",
  IN: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirin_.gif",
  IA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasiria_.gif",
  KS: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirks_.gif",
  KY: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirky_.gif",
  LA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirla_.gif",
  ME: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnh_.gif",
  MD: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirva_.gif",
  MA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnh_.gif",
  MI: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirmi_.gif",
  MN: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirmn_.gif",
  MS: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirms_.gif",
  MO: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirmo_.gif",
  MT: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirmt_.gif",
  NE: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirne_.gif",
  NV: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnv_.gif",
  NH: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnh_.gif",
  NJ: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirpa_.gif",
  NM: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnm_.gif",
  NY: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirny_.gif",
  NC: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirsc_.gif",
  ND: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnd_.gif",
  OH: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasiroh_.gif",
  OK: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirok_.gif",
  OR: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasiror_.gif",
  PA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirpa_.gif",
  RI: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnh_.gif",
  SC: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirsc_.gif",
  SD: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirsd_.gif",
  TN: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirtn_.gif",
  TX: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirsc.gif",
  UT: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirut_.gif",
  VT: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirnh_.gif",
  VA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirva_.gif",
  WA: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirwa_.gif",
  WV: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirva_.gif",
  WI: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirwi_.gif",
  WY: "http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmasirwy_.gif"
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

  this.getRadarByZip = function(zip, callback) {
    var lookup = zipcodes.lookup(zip);
    if (!lookup) {
      var error = new Error('Could not find zipcode');
      error.status = 404;
      callback(error, null);
    } else {
      callback(null, {
        city: lookup.city,
        radarMap: mapLookup[lookup.state] ? mapLookup[lookup.state] : null
      });
    }
  };
}

module.exports = Radar;