module.exports = function (RED) {
  'use strict';

  // the function needed by nodered to make instances of the node
  function komfoventNodeSet (config) {
    RED.nodes.createNode(this, config);

    // initial config of the node //
    const KomfoClass = require('./komfovent.js');
    const komfoInt = new KomfoClass();
    const node = this; // explicit context, this node
    node.displayName = config.displayName;
    // Retrieve the config node and validate
    try {
      node.komfoUser = RED.nodes.getNode(config.user);
    }
    catch (err) {
      node.error('Komfovent - Error, no login node exists - komfovent - setter.js l-13: ' + err);
      node.debug('Komfovent - Couldnt get config node : ' + this.komfoUser);
      return;
    }
    // validate settings when creating node
    if (typeof node.komfoUser === 'undefined' || !node.komfoUser || !node.komfoUser.credentials.username || !node.komfoUser.credentials.password) {
      node.error('Komfovent - No credentials given! Missing config node details. komfovent setter.js l-17 :' + node.komfoUser);
      return;
    }
    if (typeof node.komfoUser.ip === 'undefined' || !node.komfoUser.ip) {
      node.error('Komfovent - No IP to komfovent unit found, cannot continue');
      return;
    }
    const credentials = node.komfoUser.credentials;
    // node established

    // ----- INPUT event ----
    // what to do with payload incoming ///
    node.on('input', function (msg, send, done) {
      // validate input, right mode and lookup code
      const pay = msg.payload.toLowerCase();
      const mode = { name: 'auto', code: '285=2' };
      switch (pay) {
        case 'away':
          mode.code = node.komfoUser.mode.away;
          break;
        case 'home':
          mode.code = node.komfoUser.mode.home;
          break;
        case 'intensive':
          mode.code = node.komfoUser.mode.intensive;
          break;
        case 'boost':
          mode.code = node.komfoUser.mode.boost;
          break;
        case 'auto':
          mode.code = node.komfoUser.mode.auto;
          break;
        default:
          node.warn('Komfovent - unsupported mode');
          msg.payload = { error: true, result: 'Unsupported mode', unit: node.komfoUser.ip };
          send(msg);
          return;
      }
      mode.name = pay; // mode sent as command, validated to exist now
      // logon to komfovent each time, with callback below
      node.debug('Komfovent - connecting to adress http://' + node.komfoUser.ip);
      // logon and set unit mode
      set(msg.payload, komfoInt, credentials, node)
        .then(result => {
          msg.payload = result;
          send(msg);
          done();
        })
        .catch(error => {
          msg.payload = error;
          // should not end up here with normal errors, brake the flow if so
          done(error);
        });
    }); // this on.input end
  }

  // Function to set async with logon
  async function set (mode, komfoInt, credentials, node) {
    try {
      const logonResult = await komfoInt.logon(credentials.username, credentials.password, node.komfoUser.ip);
      if (!logonResult.error) {
        const getResult = await komfoInt.setMode(mode, node.komfoUser.ip);
        return getResult;
      }
      else {
        return logonResult;
      }
    }
    catch (error) {
      return error;
    }
  }
  /* / function purely for handling logon
  async function komfoLogon (node) {
    request = require('axios');// require('request');
    let result;
    const postConfig = {
      url: 'http://' + node.komfoUser.ip,
      // headers: { 'Content-Length': logonBody.length },
      method: 'POST',
      body: '1=' + node.komfoUser.credentials.username + '&' + '2=' + node.komfoUser.credentials.password
    };
    // Make a request for logon
    try {
      result = await request(postConfig);
    }
    catch (err) {
      node.error('Komfovent - Problem logging on komfovent: ' + JSON.stringify(err));
      if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
        node.error('address not found for unit' + node.komfoUser.ip);
        return { error: true, result: err };
      }
      else {
        node.error('unknown issue connecting');
        return { error: true, result: err };
      }
    } // catch error end
    // check that we are actually logged on
    if (result.data.indexOf('Incorrect password!') >= 0 || result.status > 200) {
      node.error('Komfovent - wrong password for unit');
      node.debug('Komfovent return: ' + result.body);
      return { error: true, result: 'Wrong password for unit' };
    }
    else if (result.data.indexOf('value="Logout') >= 0 && result.status === 200) {
      // then assume we are logged on correctly
      return { error: false, result: 'logged on' };
    }
    else {
      // seems like something unknown failed, the beauty of screenscraping
      console.log('error something');
      return { error: true, result: 'Something totally unknown happened with logon' };
    }
  }

  // function for setting mode
  async function komfoMode (mode, node) {
    request = require('axios');// require('request');
    let result;
    // defining message needed by c6 to switch modes
    const postConfig = {
      url: 'http://' + node.komfoUser.ip + '/ajax.xml',
      // headers: { 'Content-Length': logonBody.length },
      method: 'POST',
      body: mode.code
    };
    // make request for mode change
    try {
      result = await request(postConfig);
    }
    catch (err) {
      node.debug('Komfovent - set-mode result - Error ' + err);
      node.error('Komfovent - Problem setting mode : ' + JSON.stringify(err));
      if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
        node.error('Komfovent - cannot reach unit for set-mode, unit not found - ' + node.komfouser.ip);
        return { error: true, result: 'Could not connect to host' };
      }
      else {
        node.error('unknown connection issue setting mode' + node.komfoUser.ip);
        return { error: true, result: 'Unknown connection issue when setting mode' };
      }
    }
    if (result.status === 200 && result.data.indexOf('c6') > 0) {
      // then assuming it was ok, right http and the weird standard body response from C6 controller
      return { error: false, result: mode.name, unit: node.komfoUser.ip };
    }
  } */

  RED.nodes.registerType('komfoventNodeSet', komfoventNodeSet);
};
