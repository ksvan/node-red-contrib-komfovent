/* eslint-env mocha */
'use strict';
let should = require('should');
let nock = require('nock');
let helper = require('node-red-node-test-helper');
let komfoSetNode = require('../komfnodes/setter.js');
let komfoConfNode = require('../komfnodes/config.js');

const netScope = 'http://192.168.1.1';

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
      .log(console.log)
      .persist()
      .get('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    nock(netScope)
      .log(console.log)
      .persist()
      .post('/')
      .replyWithFile(200, `${__dirname}/index.html`);
    // intercept auth token, reply with fake token
    nock(netScope)
      .log(console.log)
      .persist()
      .post('/ajax.xml')
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
    helper.stopServer(done);
  });

  // the way node-red defines flows and relations between nodes, and sets their initial values
  let flow = [
    { id: 'nc', type: 'komfoventConfig', 'ip': '192.168.1.1', displayName: 'Komfovent Site', 'z': 'f1' },
    { id: 'n1', type: 'komfoventNode', displayName: 'Komfo set Data', user: 'nc', wires: [['nh']], 'z': 'f1' },
    { id: 'nh', type: 'helper', 'z': 'f1' },
    { id: 'f1', type: 'tab', label: 'Test flow' }
  ];
  // seperat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
  let credentials = { nc: { 'username': 'user', 'password': '1234' } };

  // node should be loaded fine in the runtime
  it('should be loaded', function (done) {
    helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      n1.should.have.property('displayName', 'Komfo set Data');
      done();
    });
  });

  // Node should have logon credentials needed
  it('should have credentials', function (done) {
    helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      n1.komfoUser.credentials.should.have.property('username', 'user');
      n1.komfoUser.should.have.property('ip', '192.168.1.1');
      n1.komfoUser.credentials.should.have.property('password', '1234');
      // check if credentials are there
      done();
    });
  }); // it end



// Node should reply with error, unknown value
it('should return error', function (done) {
    this.timeout(5000);
    helper.load([komfoSetNode, komfoConfNode], flow, credentials, function () {
      let n1 = helper.getNode('n1');
      let nh = helper.getNode('nh');
      nh.on('input', msg =>  {
        msg.payload.should.have.property('error', true);
        msg.payload.should.have.property('result', 'Unsupported mode');
        done();
      });
      n1.on('call:log', call => {
        console.log("error: " + call)
      });
      n1.receive({ payload: 'v_s1ert' }); // not existing mode
    });
  }); // it end

});
