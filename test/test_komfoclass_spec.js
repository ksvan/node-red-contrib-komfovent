/* eslint-env mocha */
'use strict';
const Komfovent = require('../komfnodes/komfovent.js');
const should = require('should');
const nock = require('nock');
const Cheerio = require('cheerio');
const ip = process.env.INTEGRATION_IP || '192.168.1.1'; // main ip to test with
const ip2 = '192.168.1.2'; // work around :( cannot make nock body matches to evaluate wrong username
const netScope = 'http://' + ip; // Ip/scope for main test scope
const netScope2 = 'http://' + ip2; // IP/scope for corner cases
// seperat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
const credentials = { username: 'user', password: '1234' };
const mode = { name: 'auto', code: '285=2' }; // settings object for mode change tests
const badMode = { name: 'autoish', code: '2567=234' }; // settings object for mode change tests
const wrongIp = '192.168.2.2';
nock.disableNetConnect(); // do not allow tests to hit network, fail instead
/*
* * mocked testing of spec only.
* TODO: duplicate without mocking as integration test (allow connection, no mocking, real ip)
* TODO: tests with new mocks that fails on web fetch and scraping (partial done)
*/

describe('Komfovent integration class', function () {
  before(function () {
    // intercept search for main page
    nock(netScope)
      .persist()
      .get('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept search for details page
    nock(netScope)
      .persist()
      .get('/det.html')
      .replyWithFile(200, `${__dirname}/det.html`);
    // intercept posts for logon fail
    // TODO NOT matching post body in mocking, current workaround is other netscope
    nock(netScope2)
      .persist()
      .post('/')
      .replyWithFile(200, `${__dirname}/indexnologon.html`);
    // intercept posts for logon correct
    nock(netScope)
      .persist()
      .post('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept ajax commands for modes
    nock(netScope)
      .persist()
      .post('/ajax.xml')
      .delay(500)
      .replyWithFile(200, `${__dirname}/ajax.xml`);
    // intercept ajax commands ffor failing pages
    nock(netScope)
      .persist()
      .get('/failing.html')
      .delay(200);
      // .replyWithFile(404, `${__dirname}/ajax.xml`); // TODO fix page
  });

  after(function () {
    nock.cleanAll();
  });

  describe('Komfovent class - makeRequest', function () {
    it('Should fetch page fine', function (done) {
      const komfo = new Komfovent();
      const postConfig = {
        url: 'http://' + ip,
        method: 'GET'
      };
      komfo.makeRequest(postConfig)
        .then(result => {
          result.should.have.property('status', 200);
          result.should.have.property('data');
          done();
        })
        .catch(error => {
          console.log('Error making request' + error);
          // console.dir(error);
        });
    });
    it('Should fail to fetch page - bad page', function (done) {
      const komfo = new Komfovent();
      const postConfig = {
        url: 'http://' + ip + '/failing.html',
        method: 'GET'
      };
      komfo.makeRequest(postConfig)
        .then(result => {
          // failing if here, should throw
          console.log('Error making failing request');
          console.dir(result);
        })
        .catch(error => {
          // unit should have responded 404, but it seems to only drop these request
          error.toString().should.startWith('Error: Unit did not respond');
          done();
        });
    });
    it('Should fail to fetch page - no response bad ip', function (done) {
      const komfo = new Komfovent();
      const postConfig = {
        url: 'http://' + ip2 + '/failing.html',
        method: 'GET'
      };
      komfo.makeRequest(postConfig)
        .then(result => {
          // failing if here, should throw
          console.log('Error making failing request no response');
          console.dir(result);
        })
        .catch(error => {
          error.toString().should.startWith('Error: Unit did not respond');
          done();
        });
    });
  });

  describe('Komfovent init and logon', function () {
  // node should be loaded as a new instance
    it('Class should be created by new', function (done) {
      const komfo = new Komfovent();
      komfo.should.be.an.instanceof(Komfovent);
      done();
    });

    // node should logon
    it('should logon fine given right credentials and ip', function (done) {
      const komfo = new Komfovent();
      komfo.logon(credentials.username, credentials.password, ip)
        .then(result => {
          result.should.have.property('error', false);
          result.should.have.property('result', 'logged on');
          done();
        })
        .catch(error => {
          console.log('Error logging on: ' + error);
          console.dir(error);
        });
    });

    // node should not logon wrong password
    it('logon should fail with error given wrong password', function (done) {
      const komfo = new Komfovent();
      komfo.logon(credentials.username + 'er', credentials.password + 'er', ip2)
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result', 'Wrong password for unit');
          done();
        })
        .catch(error => {
          console.log('Error handling wrong password' + error);
          // console.dir(error);
        });
    });

    // node should not logon blank password
    it('logon should fail with error - blank password', function (done) {
      const komfo = new Komfovent();
      komfo.logon(credentials.username, '', ip)
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result', 'Empty username/password received, quitting');
          done();
        })
        .catch(error => {
          console.log('Error handling blank password' + error);
          // console.dir(error);
        });
    });

    // node should not logon numeric username
    it('logon should fail with error - numeric username', function (done) {
      const komfo = new Komfovent();
      komfo.logon(123456, credentials.password, ip)
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result', 'Empty username/password received, quitting');
          done();
        })
        .catch(error => {
          console.log('Error handling numeric username' + error);
          // console.dir(error);
        });
    });

    // node should not logon given wrong ip
    it('logon should fail with error - wrongip', function (done) {
      const komfo = new Komfovent();
      komfo.logon(credentials.username, credentials.password, wrongIp)
        .then(result => {
          result.should.have.property('error', true);
          result.result.should.startWith('Error: Unit did not respond');
          done();
        })
        .catch(error => {
          console.log('Error handling wrong ip ' + error);
          // console.dir(error);
        });
    });
    // node should fail logon with blank ip
    it('logon should fail with error - Empty ip', function (done) {
      const komfo = new Komfovent();
      komfo.logon(credentials.username, credentials.password, '')
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result', 'Empty IP received, quitting');
          done();
        })
        .catch(error => {
          console.log('Error handling emptyy ip ' + error);
          console.dir(error);
        });
    });
  });

  // node should switch mode (IRL wont work without logon first, but mocked here)
  describe('Setting and getting modes', function () {
    it('should set mode', function (done) {
      const komfo = new Komfovent();
      komfo.setMode(mode, ip)
        .then(result => {
          result.should.have.property('error', false);
          result.should.have.property('result', mode.name);
          done();
        })
        .catch(error => {
          console.log('Error setting mode: ' + error);
          console.dir(error);
        });
    });
    // ashould fail to set mode, none existing mode. Currently no response indicating error from the C6 controller found. Cannot be tested or handled
    /* it('should fail set mode - bad mode', function (done) {
      const komfo = new Komfovent();
      komfo.setMode(badMode, ip)
        .then(result => {
          result.should.have.property('error', false); // TODO change when logic to validate device reply is implemented. lacking debug data from device
          result.should.have.property('result', badMode.name);
          done();
        })
        .catch(error => {
          console.log('Error setting mode: ' + error);
          console.dir(error);
        });
    }); */
    it('should fetch active mode', function (done) {

      const komfo = new Komfovent();
      komfo.getMode(ip)
        .then(result => {
          result.should.equal('oc-2');

          done();
        })
        .catch(error => {
          console.log('Error fetching mode: ' + error);
          console.dir(error);
        });
    });
  });

  describe('Fetching data points', function () {
  // node should fetch humidity level
    it('should fetch humidity', function (done) {
      const komfo = new Komfovent();
      komfo.getId('v_s1', ip)
        .then(result => {
          result.should.have.property('error', false);
          result.should.have.property('result', '52 %');
          done();
        })
        .catch(error => {
          console.log('Error fetching data: ');
          console.dir(error);
        });
    });

    // node should fetch supply temp
    it('should fetch supply temp', function (done) {
      const komfo = new Komfovent();
      komfo.getId('ai0', ip)
        .then(result => {
          result.should.have.property('error', false);
          result.should.have.property('result', '21.0 �C');
          done();
        })
        .catch(error => {
          console.log('Error fetching data: ');
          console.dir(JSON.stringify(error));
        });
    });

    // node should fetch an error due to wrong id
    it('should fail fetching due to bad ID', function (done) {
      const komfo = new Komfovent();
      komfo.getId('a0drt1', ip)
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result', 'ID not found');
          done();
        })
        .catch(error => {
          console.log('Error fetching data: ');
          console.dir(error);
        });
    });
    // node should fetch an error due to blank id
    it('should fail fetching due to blank id', function (done) {
      const komfo = new Komfovent();
      komfo.getId('', ip)
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result', 'Empty ID recieved, quitting');
          done();
        })
        .catch(error => {
          console.log('Error fetching data: ');
          console.dir(error);
        });
    });
    // node should fetch an error due to wrong IP (not mocked)
    it('should fail fetching due to wrong IP', function (done) {
      const komfo = new Komfovent();
      komfo.getId('ai0', wrongIp)
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result');
          result.result.should.startWith('Could not fetch data');
          done();
        })
        .catch(error => {
          console.log('Error fetching data: ');
          console.dir(error);
        });
    });
    // node should fetch an error due to blank ip
    it('should fail fetching due to blank IP', function (done) {
      const komfo = new Komfovent();
      komfo.getId('ai0', '')
        .then(result => {
          result.should.have.property('error', true);
          result.should.have.property('result', 'Empty IP recieved, quitting');
          done();
        })
        .catch(error => {
          console.log('Error fetching data: ');
          console.dir(error);
        });
    });
  });
});
