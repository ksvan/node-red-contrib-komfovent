module.exports = function (RED) {
  'use strict';
  var request = require('request');

  function komfoventNode (config) {
    RED.nodes.createNode(this, config);

    // initial config of the node  ///
    var node = this;

    // Retrieve the config node
    try {
      this.komfoUser = RED.nodes.getNode(config.user);
    } catch (err) {
      this.error('Komfovent - Error, no login node exists - komfovent - setter.js l-13: ' + err);
      this.debug('Komfovent - Couldnt get config node : ' + this.komfoUser);
    }
    // validate settings when creating node
    if (typeof node.komfoUser === 'undefined' || !node.komfoUser || !node.komfoUser.credentials.username || !node.komfoUser.credentials.password) {
      this.warn('Komfovent - No credentials given! Missing config node details. komfovent setter.js l-17 :' + node.komfoUser);
      return;
    }
    if (typeof node.komfoUser.ip === 'undefined' || !node.komfoUser.ip) {
      this.warn('Komfovent - No IP to komfovent unit found, cannot continue');
      return;
    }

    // what to do with payload incoming ///
    this.on('input', function (msg) {
      // validate input, right mode and lookup code
      var pay = msg.payload;
      var mode = { name: 'auto', code: '285=2' };
      mode.name = pay;
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
          msg.payload = { Error: true, details: 'unsupported mode', unit: node.komfoUser.ip };
          node.send(msg);
          return;
      }

      // logon to komfovent each time, with callback below
      node.debug('Komfovent - connecting to adress http://' + node.komfoUser.ip);
      komfoLogon(node, msg, function (result) {
        msg.payload = result;
        if (result.error) {
          // didnt work, return msg with error to the flow
          node.send(msg);
        }
        else {
          // send http ajax to set mode, with callback below
          komfoMode(mode, node, msg, function (result) {
            msg.payload = result;
            node.send(msg);
          }); // komfomode end
          node.send(msg);
        }
      }); // komfologon end
    }); // this on.input end
  }

  // function purely for handling logon
  function komfoLogon (node, msg, call) {
    node.debug('Payload start of logon: ' + msg.payload);
    // remove this debug before push/use/publish/deploy
    node.debug('Komfovent password---' + node.komfoUser.credentials.username + '---\n\r');
    node.debug('Komfovent password---' + node.komfoUser.credentials.password + '---\n\r');
    request.post({
      url: 'http://' + node.komfoUser.ip,
      host: node.komfoUser.ip,
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: '1=' + node.komfoUser.credentials.username + '&' + '2=' + node.komfoUser.credentials.password
    }, function (err, result, body) {
      node.debug('Komfovent -  logon result - Error ' + err);
      // node.debug('komfovent result is in komfo - Body ' + result.body)
      if (err) {
        node.warn('Komfovent - Problem logging on komfovent: ' + JSON.stringify(err));
        if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
          return call({ error: true, result: 'address not found for unit', unit: node.komfoUser.ip });
        } else {
          return call({ error: true, result: JSON.stringify(err), unit: node.komfoUser.ip });
        }
      }
      else if (result.body.indexOf('Incorrect password!') >= 0) {
        node.warn('Komfovent - wrong password for unit');
        node.debug('Komfovent return: ' + result.body);
        
        return call({ error: true, result: 'wrong password ', unit: node.komfoUser.ip });
      }
      else {
        // for now, assuimg this means we're logged on
        node.debug('Komfovent - got logon result back - success');
        return call({ error: false, result: 'logged on', unit: node.komfoUser.ip });
      }
    });
  }

  // function for setting mode
  function komfoMode (mode, node, msg, call) {
    node.debug('Payload start function ' + mode.code);
    request.post({
      url: 'http://' + node.komfoUser.ip + '/ajax.xml',
      host: node.komfoUser.ip,
      method: 'POST',
      headers: { 'connection': 'keep-alive', 'content-type': 'text/plain;charset=UTF-8', 'origin': 'http://' + node.komfoUser.ip },
      body: mode.code
    }, function (err, result, body) {
      node.debug('Komfovent - set-mode result - Error ' + err);
      // node.debug('komfovent result is in komfo - Body ' + result.body)
      if (err) {
        node.warn('Komfovent - Problem setting mode : ' + JSON.stringify(err));
        if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
          node.warn('Komfovent - cannot reach unit for set-mode - ' + node.komfouser.ip);
          return call({ error: true, result: 'unit not found with address ', unit: node.komfoUser.ip });
        } else {
          return call({ error: true, result: JSON.stringify(err), unit: node.komfoUser.ip });
        }
      }
      else {
        // for now assuming this means mode has been set
        node.debug('Komfovent setmode return status: ' + result.statusCode);
        node.debug('Komfovent set mode - retuned body \n\r' + result.body);
        return call({ error: false, result: mode.name, unit: node.komfoUser.ip });
      }
    });
  }

  RED.nodes.registerType('komfoventNode', komfoventNode);
};
