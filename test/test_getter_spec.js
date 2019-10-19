/* eslint-env mocha */
/* Testing of the getter node, using the komfovent integration class.
* Testing is based on node-red stack, using the node-red-test-helper. Nodes are actually launched by node-red and
* flows are run. This however means access to certain output needs to be harvested from node-red log, by the test helper.
* So one more thing to maintain and possible failures.
* TODO: same setup without mocking for actuall integration test
*/
'use strict';
const should = require('should');
const nock = require('nock');
const helper = require('node-red-node-test-helper');
const komfoGetNode = require('../komfnodes/getter.js');
const komfoConfNode = require('../komfnodes/config.js');

const netScope = 'http://192.168.1.1';
const netScope2 = 'http://192.168.2.1';

helper.init(require.resolve('node-red'));
nock.disableNetConnect();

describe('Komfovent getter node-red', function () {
  before(function (done) {
    helper.startServer(done);
  });

  beforeEach(function () {
    // setup intercepts
    // intercept search for main page
    nock(netScope)
      .persist()
      .get('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept auth token, reply with fake token
    nock(netScope)
      .persist()
      .post('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept calls for getting detail data
    nock(netScope)
      .persist()
      .get('/det.html')
      .replyWithFile(200, `${__dirname}/det.html`);
    // fake bad logon
    nock(netScope2)
      .persist()
      .post('/')
      .replyWithFile(200, `${__dirname}/indexnologon.html`);

    /* nock.emitter.on('no match', req => {
      console.log('no match: ');
    }); */
  });

  afterEach(function () {
    helper.unload();
  });

  after(function (done) {
    nock.cleanAll();
    helper.stopServer(done);
  });
  // the way nodered wants to define flows and relations, and initial values
  const flow = [
    { id: 'nc', type: 'komfoventConfig', ip: '192.168.1.1', displayName: 'Komfovent Site', z: 'f1' },
    { id: 'n1', type: 'komfoventNodeGet', displayName: 'Komfo get Data', user: 'nc', wires: [['nh']], z: 'f1' },
    { id: 'nh', type: 'helper', z: 'f1' },
    { id: 'f1', type: 'tab', label: 'Test flow' }
  ];
  // separat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
  const credentials = { nc: { username: 'user', password: '1234' } };

  describe('Node load with config', function () {
  // node should be loaded fine in the runtime
    it('should be loaded', function (done) {
      helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        n1.should.have.property('displayName', 'Komfo get Data');
        done();
      });
    });

    // Node should have logon credentials needed
    it('should have credentials', function (done) {
      helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        n1.komfoUser.credentials.should.have.property('username', 'user');
        n1.komfoUser.should.have.property('ip', '192.168.1.1');
        n1.komfoUser.credentials.should.have.property('password', '1234');
        // check if credentials are there
        done();
      });
    }); // it end

    // node should not load without confignode
    it('should be loaded with error - missing config', function (done) {
      helper.load([komfoGetNode], flow, function () {
        const n1 = helper.getNode('n1');
        should.not.exist(n1);
        done();
      });
    });

    // node should not work without credentilas
    it('should be loaded with error - missing credentials', function (done) {
      helper.load([komfoGetNode, komfoConfNode], flow, function () {
        const n1 = helper.getNode('n1');
        // get output from node.warn and log, to verify validation fail
        const log = helper.log().args.find(item => item[0].id === 'n1');
        log[0].msg.should.startWith('Komfovent - No credentials')
        should.not.exist(n1.komfoUser.credentials.username);
        done();
      });
    });
 
    // node should not work without IP
    it('should be loaded with error - missing IP', function (done) {
      const flow2 = flow.slice(); //copy array, change config, remove ip
      flow2[0] = { id: 'nc', type: 'komfoventConfig', displayName: 'Komfovent Site', z: 'f1' };
      helper.load([komfoGetNode, komfoConfNode], flow2, credentials, function () {
        const n1 = helper.getNode('n1');
        // get output from node.warn and log, to verify validation fail
        const log = helper.log().args.find(item => item[0].id === 'n1');
        log[0].msg.should.startWith('Komfovent - No IP')
        should.not.exist(n1.komfoUser.ip);
        done();
      });
    });

  });
  describe('Node fetching data', function () {
  // Node should fetch house supply temperature
    it('should fetch supply temperature', function (done) {
      try {
        helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
          const n1 = helper.getNode('n1');
          const nh = helper.getNode('nh');
          nh.on('input', msg => {
            msg.payload.should.have.property('error', false);
            msg.payload.should.have.property('result', '21.0 �C');
            msg.payload.should.have.property('unit', '192.168.1.1');
            done();
          });
          n1.receive({ payload: 'ai0' });
        });
      }
      catch (error) {
        console.log('Supply temp failed', error);
      }
    }); // it end

    // Node should fetch sensor humidty (det.html)
    it('should fetch sensor 1 humidity', function (done) {
      this.timeout(5000);
      helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        const nh = helper.getNode('nh');
        nh.on('input', msg =>  {
          msg.payload.should.have.property('error', false);
          msg.payload.should.have.property('result', '52 %');
          msg.payload.should.have.property('unit', '192.168.1.1');
          done();
        });
        n1.receive({ payload: 'v_s1' });
      });
    }); // it end

    // Node should reply with error, unknown value
    it('should return error - bad id', function (done) {
      helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        const nh = helper.getNode('nh');
        nh.on('input', msg => {
          msg.payload.should.have.property('error', true);
          msg.payload.should.have.property('result', 'ID not found');
          msg.payload.should.have.property('unit', '192.168.1.1');
          done();
        });
        n1.receive({ payload: 'v_s1ert' });
      });
    }); // it end

    // Node should reply with error, unknown user
    it('should return error - unknown user', function (done) {
      const flow2 = flow.slice(); //copy array, change config, remove ip
      flow2[0] = { id: 'nc', type: 'komfoventConfig', ip: '192.168.2.1', displayName: 'Komfovent Site', z: 'f1' };
      helper.load([komfoGetNode, komfoConfNode], flow2, credentials, function () {
        const n1 = helper.getNode('n1');
        const nh = helper.getNode('nh');
        nh.on('input', msg => {
          msg.payload.should.have.property('error', true);
          msg.payload.should.have.property('result', 'Wrong password for unit');
          msg.payload.should.have.property('unit', '192.168.2.1');
          done();
        });
        n1.receive({ payload: 'v_s1ert' });
      });
    }); // it end

    // Node should reply with error,  blank id
    it('should return error - blank id', function (done) {
      helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        const nh = helper.getNode('nh');
        nh.on('input', msg => {
          // get output from node.warn and log, to verify validation fail
          const log = helper.log().args.find(item => item[0].id === 'n1');
          log[0].should.have.property('msg', 'Komfovent - empty ID recieved, quitting');
          done();
        });
        n1.receive({ payload: '' });
      });
    });
  });
});
