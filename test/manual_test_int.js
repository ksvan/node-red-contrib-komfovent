/* eslint-env mocha */
'use strict';
const Komfovent = require('../komfnodes/komfovent.js');
const should = require('should');
const nock = require('nock');
const Cheerio = require('cheerio');
const ip = '192.168.1.234';
const netscope = 'http://' + ip;

/* manual integration test
* * meant for diverse reverse engineering testing along the way
* not part of unit, integration test or build
*/

/* nock(netscope)
  .persist()
  .get('/')
  .replyWithFile(200, `${__dirname}/index.html`)
  .log(console.log);
nock.disableNetConnect(); */

it('Manual: should fetch active mode', function (done) {
  const komfo = new Komfovent();
  komfo.getMode(ip)
    .then(result => {
      console.log('>>> \n');
      console.dir(result);
      done();
    })
    .catch(error => {
      console.log('Error fetching mode: ' + error);
      console.dir(error);
    });
});
