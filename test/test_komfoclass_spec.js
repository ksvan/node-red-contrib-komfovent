/* eslint-env mocha */
'use strict';
const Komfovent = require('../komfnodes/komfovent.js');
let should = require('should');
const nock = require('nock');

const ip = '192.168.1.1';
const netScope = 'http://' + ip;
nock.disableNetConnect();
// seperat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
const credentials = { username: 'user', password: '1234' };
const mode = { name: 'auto', code: '285=2' }; // settings object for mode change tests

/*
* * mocked testing of spec only.
* TODO: duplicate without mocking as integration test
* TODO: fix no logon test so it fails, mocking doesnt match
*/

describe('Komfovent integration class', function () {
  beforeEach(function () {
    // setup intercepts
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
    nock(netScope)
      .log(console.log)
      .persist()
      .post('/', /userer/g) // '1=' + credentials.username + 'er&2=' + credentials.password + 'er')
      .replyWithFile(404, `${__dirname}/indexnologon.html`);
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

    nock.emitter.on('no match', req => {
      console.log('no match: ');
    });
  });

  after(function () {
    nock.cleanAll();
  });

  describe('Komfovent init and logon', function () {
  // node should be loaded as a new instance
    it('Class should be created by new', function (done) {
      const komfo = new Komfovent();
      komfo.should.be.an.instanceof(Komfovent);
      done();
    });

    // node should logon
    it('should logon fine given right credentials', function (done) {
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
    it('should fail with error given wrong password', function (done) {
      const komfo = new Komfovent();
      komfo.logon(credentials.username + 'er', credentials.password + 'er', ip)
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
    it('should fetch active mode', function (done) {
      const komfo = new Komfovent();
      komfo.getMode(ip)
        .then(result => {
          console.log('>>>>> ' + JSON.stringify(result));
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

    // node should fetch an error
    it('should fail fetching', function (done) {
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
  });
});
