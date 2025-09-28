/* eslint-env mocha */
'use strict';
let should = require('should');
let nock = require('nock');
let helper = require('node-red-node-test-helper');
let komfoGetNode = require('../komfnodes/getter.js');
let komfoConfNode = require('../komfnodes/config.js');

const netScope = '192.168.1.1';

helper.init(require.resolve('node-red'));
nock.disableNetConnect();

describe('Komfovent getter node-red', function () {
  before(function (done) {
    helper.startServer(done);
  });

  beforeEach(function () {
    // setup intercepts
    // intercept search for users sites, return a list
    nock(netScope)
      .log(console.log)
      .get('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    nock(netScope)
      .log(console.log)
      .post('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept auth token, reply with fake token
    nock(netScope)
      .get('/det.html')
      .replyWithFile(200, `${__dirname}/det.html`);

    nock.emitter.on('no match', req => {
      console.log('no match' + req);
    });
  });

  afterEach(function () {
    helper.unload();
  });

  after(function (done) {
    nock.cleanAll();
    helper.stopServer(done);
  });

  let flow = [
    { id: 'nc', type: 'komfoventConfig', displayName: 'Komfovent Site', 'z': 'f1' },
    { id: 'n1', type: 'komfoventNodeGet', displayName: 'Komfo get Data', user: 'nc', wires: [['nh']], 'z': 'f1' },
    { id: 'nh', type: 'helper', 'z': 'f1' },
    { id: 'f1', type: 'tab', label: 'Test flow' }
  ];
  let credentials = { nc: { 'username': 'user', 'ip': '192.168.1.1', 'password': '1234' } };

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
      n1.komfoUser.credentials.should.have.property('ip', '192.168.1.1');
      n1.komfoUser.credentials.should.have.property('password', '1234');
      // check if credentials are there
      done();
    });
  }); // it end

  // Node should fetch house primary heating source
  it('should fetch supply temperature', function (done) {
    this.timeout(5000);
    helper.load([komfoGetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      let nh = helper.getNode('nh');
      nh.on('input', function (msg) {
        console.log('recieved')
        console.dir(msg);
        msg.payload.should.have.property('error', false);
        msg.payload.should.have.property('result', '21');
        done();
      });
      n1.receive({ payload: 'ai0' });
    });
  }); // it end
});
