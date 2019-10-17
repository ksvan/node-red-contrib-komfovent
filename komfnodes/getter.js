module.exports = function (RED) {
  'use strict';

  function komfoventNodeGet (config) {
    const komfoInt = new (require('komfovent.js'))();
    RED.nodes.createNode(this, config);
    // initial config of the node  ///
    var node = this;
    this.displayName = config.displayName;
    // Retrieve the config node and validate setup of node
    const credentials = node.komfoUser.credentials;
    try {
      this.komfoUser = RED.nodes.getNode(config.user);
    }
    catch (err) {
      node.debug('Komfovent - Couldnt get config node : ' + this.komfoUser);
      node.error('Komfovent - Error, no login node exists - komfovent - setter.js l-13: ' + err);
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

    // what to do with payload incoming ///
    this.on('input', function (msg, send, done) {
      if (typeof msg.payload !== 'string' || !msg.payload) {
        done('Komfovent - empty ID received, quitting');
      }
      // logon to unit
      komfoInt.logon(credentials.username, credentials.password, node.komfoUser.ip)
        .then(result => {
          // get the data field from the unit
          komfoInt.getId(msg.payload, node.komfouser.ip)
            .then(result => {
              // return to the flow with data
              msg.payload = { error: false, result: result, unit: node.komfoUser.ip };
              send(msg);
              done();
            });
        })
        .catch(error => {
          // TODO check flow for handling different errors. verify what is surfaced
          node.debug('Komfovent getNode error logging on');
          msg.payload = error;
          send(msg);
        });
    });// end this.on
  }; // end komfovent node get

  /* // function for fetching the page and scrape with cheerio, param page for subpages feature later
  function getPage (node, page, call) {
    request.get({
      url: 'http://' + node.komfoUser.ip + page,
      headers: { }
    },
    function (err, result, body) {
      node.debug('Komfovent -  logon result - Error ' + err);
      if (!err) {
        call(result, body);
      }
      else {
        node.debug('Error getting page');
        call({ error: true, result: JSON.stringify(err), unit: node.komfoUser.ip }, '');
      }
    });
  }

  // function purely for handling logon (yes, currently duplicated from setter.js)
  function komfoLogon (node, call) {
    var logonBody = '1=' + node.komfoUser.credentials.username + '&' + '2=' + node.komfoUser.credentials.password;
    request.post({
      url: 'http://' + node.komfoUser.ip,
      headers: { 'Content-Length': logonBody.length },
      body: logonBody
    }, function (err, result, body) {
      // node.debug('Komfovent -  logon result - Error ' + err);
      if (err) {
        node.debug('Komfovent - Problem logging on komfovent: ' + JSON.stringify(err));
        if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
          call({ error: true, result: 'address not found for unit', unit: node.komfoUser.ip });
        }
        else {
          call({ error: true, result: JSON.stringify(err), unit: node.komfoUser.ip });
        }
      }
      else if (body.indexOf('Incorrect password!') >= 0) {
        node.debug('Komfovent return: ' + result.body);
        call({ error: true, result: 'wrong password ', unit: node.komfoUser.ip });
      }
      else {
        // for now, assuimg this means we're logged on
        call({ error: false, result: 'logged on', unit: node.komfoUser.ip });
      }
    });
  } */
  RED.nodes.registerType('komfoventNodeGet', komfoventNodeGet);
};
