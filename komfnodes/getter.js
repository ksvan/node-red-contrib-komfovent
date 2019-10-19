module.exports = function (RED) {
  'use strict';

  function komfoventNodeGet (config) {
    const KomfoClass = require('./komfovent.js');
    const komfoInt = new KomfoClass();
    RED.nodes.createNode(this, config);
    // initial config of the node  ///
    var node = this;
    this.displayName = config.displayName;
    // Retrieve the config node and validate setup of node
    try {
      node.komfoUser = RED.nodes.getNode(config.user);
    }
    catch (err) {
      node.debug('Komfovent - Couldnt get config node : ' + node.komfoUser);
      node.error('Komfovent - Error, no login node exists - komfovent - setter.js l-13: ' + err);
      return;
    }
    const credentials = node.komfoUser.credentials;
    // validate settings when creating node
    if (typeof node.komfoUser === 'undefined' || !node.komfoUser || !credentials.username || !credentials.password) {
      node.error('Komfovent - No credentials given! Missing config node details. komfovent setter.js l-17 :' + node.komfoUser);
      return;
    }
    if (typeof node.komfoUser.ip === 'undefined' || !node.komfoUser.ip) {
      node.error('Komfovent - No IP to komfovent unit found, cannot continue');
      return;
    }
    // -------- INPUT event
    // what to do with payload incoming ///
    node.on('input', function (msg, send, done) {
      // if input is blank, do nothin, breake the flow
      if (typeof msg.payload !== 'string' || !msg.payload) {
        done('Komfovent - empty ID recieved, quitting');
      }
      // logon and fetch from unit
      fetch(msg.payload, komfoInt, credentials, node)
        .then(result => {
          msg.payload = result;
          send(msg);
          done();
        })
        .catch(error => {
          msg.payload = error;
          send(msg);
          done(error);
        });
    });// end this.on
  }; // end komfovent node get

  // Function to fetch async with logon
  async function fetch (id, komfoInt, credentials, node) {
    try {
      const logonResult = await komfoInt.logon(credentials.username, credentials.password, node.komfoUser.ip);
      if (!logonResult.error) {
        const getResult = await komfoInt.getId(id, node.komfoUser.ip);
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
  RED.nodes.registerType('komfoventNodeGet', komfoventNodeGet);
};
