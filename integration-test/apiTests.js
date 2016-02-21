'use strict';

describe('slack-weather', function() {

      var url = 'http://' + (process.env.DOCKER_HOST_ADDRESS || '127.0.0.1' ) + ':6789';
      var request = require('supertest');
      var assert = require('assert');


      describe('POST /weather', function() {

        //ensure that a successful response comes back when using the api
        it('gets current weather', function(done) {
          request(url).post('/v1/weather')
            .send({
              text: "12345"
            })
            .expect(200)
            .end(function(err, result) {
              assert(!err);
              assert(result.body.text.indexOf('Here\'s the weather in') >= 0);
              assert.strictEqual(result.body.response_type, 'in_channel');
              done();
            });
        });

      });

      //ensure that a successful response comes back when using the api
      describe('POST /forecast', function() {

        it('gets current forecast', function(done) {
          request(url).post('/v1/forecast')
            .send({
              text: "12345"
            })
            .expect(200)
            .end(function(err, result) {
              assert(!err);
              assert(result.body.text.indexOf('Here\'s the upcoming weather in') >= 0);
              assert.strictEqual(result.body.response_type, 'in_channel');
              done();
            });

        });

      });

      //ensure a successful response comes back
      describe('POST /radar', function() {

          it('gets current radar', function(done) {
              request(url).post('/v1/radar')
                .send({
                  text: ""
                })
                .expect(200)
                .end(function(err, result) {
                    assert(!err);
                    assert.strictEqual(result.body.response_type, 'in_channel');
                    assert.strictEqual(result.body.attachments[0].title, 'Here\'s the national radar map');
                    done();
                });

          });

      });
});