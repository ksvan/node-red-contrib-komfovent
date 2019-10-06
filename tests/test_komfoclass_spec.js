/* eslint-env mocha */
'use strict';
let should = require('should');
const nock = require('nock');
const KomfoClass = require('../komfnodes/komfovent.js');

const netScope = 'http://192.168.1.1';

helper.init(require.resolve('node-red'));
nock.disableNetConnect();

describe('Komfovent integration class', function () {
  before(function (done) {
   
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
  
  });

  after(function (done) {
    nock.cleanAll();
  });

  // seperat secret credentials object to be passed in at launch, adhering to how nodered protects secrets
  const credentials = { username: 'user', password: '1234' };

  // node should be loaded fine in the runtime
  it('should be loaded', function (done) {
    const komfo = new KomfoClass();
    komfo.should.have.typeOf(object);
  });
});
