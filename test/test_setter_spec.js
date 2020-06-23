/* eslint-env mocha */
'use strict';
// const should = require('should');
const nock = require('nock');
const helper = require('node-red-node-test-helper');
const komfoSetNode = require('../komfnodes/setter.js');
const komfoConfNode = require('../komfnodes/config.js');

const netScope = 'http://192.168.1.1';
const ip = '192.168.1.1';
// const ip2 = '192.168.2.1';

helper.init(require.resolve('node-red'));
nock.disableNetConnect();

describe('Komfovent setter node-red', function () {
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
    nock(netScope)
      .persist()
      .post('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept auth token, reply with fake token
    nock(netScope)
      .persist()
      .post('/ajax.xml')
      .delay(500)
      .replyWithFile(200, `${__dirname}/ajax.xml`);

    nock.emitter.on('no match', req => {
      console.log('no match: ');
    });
  });

  afterEach(function () {
    helper.unload();
  });

  after(function (done) {
    nock.cleanAll();
    helper.unload().then(function () {
      helper.stopServer(done);
    });
  });

  // the way node-red defines flows and relations between nodes, and sets their initial values
  const flow = [
    { id: 'nc', type: 'komfoventConfig', ip: ip, displayName: 'Komfovent Site', z: 'f1' },
    { id: 'n1', type: 'komfoventNodeSet', displayName: 'Komfo set Data', user: 'nc', wires: [['nh']], z: 'f1' },
    { id: 'nh', type: 'helper', z: 'f1' },
    { id: 'f1', type: 'tab', label: 'Test flow' }
  ];
  // seperat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
  const credentials = { nc: { username: 'user', password: '1234' } };

  describe('Node load with config', function () {
  // node should be loaded fine in the runtime
    it('should be loaded', function (done) {
      helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        n1.should.have.property('displayName', 'Komfo set Data');
        done();
      });
    });

    // Node should have logon credentials needed
    it('should have credentials', function (done) {
      helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        n1.komfoUser.credentials.should.have.property('username', 'user');
        n1.komfoUser.should.have.property('ip', ip);
        n1.komfoUser.credentials.should.have.property('password', '1234');
        // check if credentials are there
        done();
      });
    }); // it end
  });
  // Node should reply with error, unknown value

  describe('Node setting mode', function () {
    it('should return error', function (done) {
      this.timeout(5000);
      helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        const nh = helper.getNode('nh');
        nh.on('input', msg => {
          msg.payload.should.have.property('error', true);
          msg.payload.should.have.property('result', 'Unsupported mode');
          done();
        });
        n1.on('call:error', call => {
          console.log('error: ' + call);
        });
        n1.receive({ payload: 'v_s1ert' }); // not existing mode
      });
    }); // it end

    // Node should reply with changed mode
    it('should return changed mode w delay', function (done) {
      this.timeout(5000);
      helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        const nh = helper.getNode('nh');
        nh.on('input', msg => {
          msg.payload.should.have.property('error', false);
          msg.payload.should.have.property('result', 'auto');
          done();
        });
        n1.on('call:error', call => {
          console.log('error: ' + call);
        });
        n1.receive({ payload: 'auto' }); //  existing mode
      });
    }); // it end
  });

  describe('Node fetching current mode', function () {
  // Node should reply with changed mode
    it('should return current mode', function (done) {
      // this.timeout(5000);
      helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
        const n1 = helper.getNode('n1');
        const nh = helper.getNode('nh');
        nh.on('input', msg => {
          msg.payload.should.have.property('error', false);
          msg.payload.should.have.property('result', 'auto');
          done();
        });
        n1.on('call:error', call => {
          console.log('error: ' + call);
        });
        n1.receive({ payload: 'auto' }); //  existing mode
      });
    }); // it end
  });
});
