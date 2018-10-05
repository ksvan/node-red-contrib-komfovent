module.exports = function (RED) {
  'use strict';
  var request;
  var scrape;
  var logon;

  function komfoventNodeGet (config) {
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
      request = require('request');
      scrape = require('cheerio');
      komfoLogon(node, function (result) {
        if (result.error) {
          node.debug('Komfovent getnode error logon');
          return;
        } else {
          var body;
          getPage(node, function (result, body) {
            if (!result.err) {
              body = scrape.load(body);
              msg.payload = body('#ai0').text();
              node.send(msg);
            }
            else {
              node.warn('error fetching page');
            }
          });
        }
      });
    });// end this.on
  } // end komfovent node get

  // function for fetching the page and scrape with cherio
  function getPage (node, call) {
    request.post({
      url: 'http://' + node.komfoUser.ip,
      headers: { }
    },
    function (err, result, body) {
      node.debug('Komfovent -  logon result - Error ' + err);
      if (!err) {
        return call(result,body);
      }
      else {
        node.warn('Error getting page');
        return call(result,body);
      }
    });
  }

  // function purely for handling logon
  function komfoLogon (node, call) {
    var logonBody = '1=' + node.komfoUser.credentials.username + '&' + '2=' + node.komfoUser.credentials.password;
    request.post({
      url: 'http://' + node.komfoUser.ip,
      headers: { 'Content-Length': logonBody.length },
      body: logonBody
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
      else if (body.indexOf('Incorrect password!') >= 0) {
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

  RED.nodes.registerType('komfoventNodeGet', komfoventNodeGet);
};
