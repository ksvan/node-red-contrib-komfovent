/* eslint-env mocha */
'use strict';
const Komfovent = require('../../komfnodes/komfovent.js');
const should = require('should');
const Cheerio = require('cheerio');
const ip = process.env.INTEGRATION_IP || '192.168.1.1'; // main ip to test with
const wrongIp = '192.168.2.2'; // should be outside of local net, not working
// seperat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
const credentials = { username: 'user', password: '1234' };
const mode = { name: 'auto', code: '285=2' }; // settings object for mode change tests
const badMode = { name: 'autoish', code: '2567=234' }; // settings object for mode change tests

/*
* * Integration test with Comfovent c6 controller, for komfovent class standalone
* pretty much the same as unit test, but tests on bad ip's not included by default (doesnt resolve/reject before after system tcp 
* init timeout, 75s on mac). Can still be configured with env var
* TODO: Add regex validation of fetched values, since they cannot be static set with a live system
*/

// check if integration test
const intTest = process.env.INTEGRATION; // true
const timeOutTest = process.env.INTEGRATION_TIMEOUT || false;// true, blank
credentials.username = process.env.INTEGRATION_USER || 'user'; // username, blank for default 
credentials.password = process.env.INTEGRATION_PWD || ''; // real password, int_test.sh will ask

console.log('>>> RUNNING INTEGRATION TEST <<<<');
console.log('with user: ' + credentials.username + ' and ip: ' + ip);

describe('Integration: Komfovent setter node-red', function () {
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
    if (timeOutTest) {
      it('Should fail to fetch page - no response bad ip', function (done) {
        this.timeout(0); // to cater for system setting on tcp init timeout (75s on mac)
        const komfo = new Komfovent();
        const postConfig = {
          url: 'http://' + wrongIp + '/failing.html',
          method: 'GET'
        };
        komfo.makeRequest(postConfig)
          .then(result => {
          // failing if here, should throw
            console.log('Error making failing request no response');
            console.dir(result);
          })
          .catch(error => {
            console.log('>>>error', error);
            error.toString().should.startWith('Error: Unit did not respond');
            done();
          });
      });
    }
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
      komfo.logon(credentials.username + 'er', (credentials.password + 'er'), ip)
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
    if (timeOutTest) {
      it('logon should fail with error - wrongip', function (done) {
        this.timeout(0);
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
    }
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

  // node should switch mode 
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
          result.should.be('oc-2');
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
          // result.should.have.property('result', '52 %');
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
          // result.should.have.property('result', '21.0 �C');
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
    // node should fetch an error due to wrong IP
    if (timeOutTest) {
      it('should fail fetching due to wrong IP', function (done) {
        this.timeout(5000);
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
    }
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
