module.exports = function (RED) {
  'use strict';
  var request;

  function komfoventNode (config) {
    RED.nodes.createNode(this, config);

    // initial config of the node //
    var node = this; // explicit context, this node
    node.displayName = config.displayName;
    // Retrieve the config node
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

    // what to do with payload incoming ///
    node.on('input', function (msg, send, done) {
      // validate input, right mode and lookup code
      var pay = msg.payload.toLowerCase();
      var mode = { name: 'auto', code: '285=2' };
      request = require('request');

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
      mode.name = pay;
      // logon to komfovent each time, with callback below
      node.debug('Komfovent - connecting to adress http://' + node.komfoUser.ip);
      komfoLogon(node, msg, function (result) {
        msg.payload = result;
        if (result.error) {
          // didnt work, return msg with error to the flow
          node.error('An error occured logging on');
          send(msg);
          done('An error occured logging on');
        }
        else {
          // send http ajax to set mode, with callback below
          komfoMode(mode, node, msg, function (result) {
            msg.payload = result;
            send(msg);
            done();
          }); // komfomode end
        }
      }); // komfologon end
    }); // this on.input end
  }

  // function purely for handling logon
  function komfoLogon (node, msg, call) {
    var logonBody = '1=' + node.komfoUser.credentials.username + '&' + '2=' + node.komfoUser.credentials.password;
    request.post({
      url: 'http://' + node.komfoUser.ip,
      headers: { 'Content-Length': logonBody.length },
      body: logonBody
    }, function (err, result, body) {
      // node.debug('Komfovent -  logon result - Error ' + err);
      if (err) {
        node.error('Komfovent - Problem logging on komfovent: ' + JSON.stringify(err));
        if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
          node.error('address not found for unit' + node.komfoUser.ip);
          call({ error: true, result: err });
        }
        else {
          node.error('unknown issue connecting');
          call({ error: true, result: err });
        }
      }
      else if (body.indexOf('Incorrect password!') >= 0) {
        node.error('Komfovent - wrong password for unit');
        node.debug('Komfovent return: ' + result.body);
        call({ error: true, result: err });
      }
      else {
        // for now, assuimg this means we're logged on
        // node.debug('Komfovent - got logon result back - success');
        call({ error: false, result: 'logged on' });
      }
    });
  }

  // function for setting mode
  function komfoMode (mode, node, msg, call) {
    node.debug('Payload start function ' + mode.code);
    request.post({
      url: 'http://' + node.komfoUser.ip + '/ajax.xml',
      headers: { 'Content-Length': mode.code.length },
      body: mode.code
    }, function (err, result) {
      // node.debug('komfovent result is in komfo - Body ' + result.body)
      if (err) {
        node.debug('Komfovent - set-mode result - Error ' + err);
        node.warn('Komfovent - Problem setting mode : ' + JSON.stringify(err));
        if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
          node.error('Komfovent - cannot reach unit for set-mode, unit not found - ' + node.komfouser.ip);
          call({ error: true, result: 'Could not connect to host' });
        }
        else {
          node.error('unknown connection issue' + node.komfoUser.ip);
          call({ error: true, result: 'Unknown connection issue' });
        }
      }
      else {
        // for now assuming this means mode has been set
        node.debug('Komfovent setmode return status: ' + result.statusCode);
        // node.debug('Komfovent set mode - returned body \n\r' + result.body);
        return call({ error: false, result: mode.name, unit: node.komfoUser.ip });
      }
    });
  }

  RED.nodes.registerType('komfoventNode', komfoventNode);
};
