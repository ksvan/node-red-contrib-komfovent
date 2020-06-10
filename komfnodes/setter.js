module.exports = function (RED) {
  'use strict';

  // the function needed by nodered to make instances of the node
  function komfoventNodeSet (config) {
    RED.nodes.createNode(this, config);
    // initial config of the node //
    const KomfoClass = require('./komfovent.js');
    const komfoInt = new KomfoClass();
    var node = this; // explicit context, this node
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
        case '':
          // blanks, fetch current status instead
          break;
        default:
          node.warn('Komfovent - unsupported mode');
          msg.payload = { error: true, result: 'Unsupported mode', unit: node.komfoUser.ip };
          send(msg);
          return;
      }
      mode.name = pay; // mode sent as command, validated to exist now
      // logon to komfovent each time, with callback below
      // node.debug('Komfovent - connecting to adress http://' + node.komfoUser.ip);
      // logon and set unit mode
      set(mode, komfoInt, credentials, node)
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
      if (!logonResult.error && mode.name !== '') {
        // if mode is given, set it
        const getResult = await komfoInt.setMode(mode, node.komfoUser.ip);
        return getResult;
      }
      else if (!logonResult.error && mode.name === '') {
        // if mode is not given, fetch current
        const getResult = await komfoInt.getMode(node.komfoUser.ip);
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
  RED.nodes.registerType('komfoventNodeSet', komfoventNodeSet);
};
