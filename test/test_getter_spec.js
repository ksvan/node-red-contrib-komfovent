/* eslint-env mocha */
'use strict';
let should = require('should');
let nock = require('nock');
let helper = require('node-red-node-test-helper');
let komfoGetNode = require('../komfnodes/getter.js');
let komfoConfNode = require('../komfnodes/config.js');

const netScope = 'http://192.168.1.1';

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
    nock(netScope)
      .persist()
      .post('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept auth token, reply with fake token
    nock(netScope)
      .persist()
      .get('/det.html')
      .replyWithFile(200, `${__dirname}/det.html`);

    nock.emitter.on('no match', req => {
      console.log('no match: ');
    });
  });

  afterEach(function () {
    helper.unload();
  });

  after(function (done) {
    nock.cleanAll();
    helper.stopServer(done);
  });

  // the way nodered wants to define flows and relations, and initial values
  let flow = [
    { id: 'nc', type: 'komfoventConfig', 'ip': '192.168.1.1', displayName: 'Komfovent Site', 'z': 'f1' },
    { id: 'n1', type: 'komfoventNodeGet', displayName: 'Komfo get Data', user: 'nc', wires: [['nh']], 'z': 'f1' },
    { id: 'nh', type: 'helper', 'z': 'f1' },
    { id: 'f1', type: 'tab', label: 'Test flow' }
  ];
  // separat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
  let credentials = { nc: { 'username': 'user', 'password': '1234' } };

  // node should be loaded fine in the runtime
  it('should be loaded', function (done) {
    helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      n1.should.have.property('displayName', 'Komfo get Data');
      done();
    });
  });

  // Node should have logon credentials needed
  it('should have credentials', function (done) {
    helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      n1.komfoUser.credentials.should.have.property('username', 'user');
      n1.komfoUser.should.have.property('ip', '192.168.1.1');
      n1.komfoUser.credentials.should.have.property('password', '1234');
      // check if credentials are there
      done();
    });
  }); // it end

  // Node should fetch house supply temperature
  it('should fetch supply temperature', function (done) {
    this.timeout(5000);
    helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      let nh = helper.getNode('nh');
      nh.on('input', msg =>  {
        msg.payload.should.have.property('error', false);
        msg.payload.should.have.property('result', '21.0 �C');
        done();
      });
      n1.on('call:log', call => {
        console.log("error: " + call)
      });
      n1.receive({ payload: 'ai0' });
    });
  }); // it end

  // Node should fetch sensor humidty (det.html)
  it('should fetch sensor 1 humidity', function (done) {
    this.timeout(5000);
    helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      let nh = helper.getNode('nh');
      nh.on('input', msg =>  {
        msg.payload.should.have.property('error', false);
        msg.payload.should.have.property('result', '52 %');
        done();
      });
      n1.on('call:log', call => {
        console.log("error: " + call)
      });
      n1.receive({ payload: 'v_s1' });
    });
  }); // it end

  // Node should reply with error, unknown value
  it('should return error', function (done) {
    this.timeout(5000);
    helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      let nh = helper.getNode('nh');
      nh.on('input', msg =>  {
        msg.payload.should.have.property('error', true);
        msg.payload.should.have.property('result', 'ID not found');
        done();
      });
      n1.on('call:log', call => {
        console.log("error: " + call)
      });
      n1.receive({ payload: 'v_s1ert' });
    });
  }); // it end
});
