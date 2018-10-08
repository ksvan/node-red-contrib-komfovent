module.exports = function (RED) {
  'use strict';
  var request;
  var scraper;

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
      scraper = require('cheerio');
      let msgResult = 't';
      if (typeof msg.payload !== 'string' || !msg.payload || msg.payload === '') {
        node.warn('Komfovent - empty ID received, quitting');
        return;
      }
      komfoLogon(node, function (resultLogon) {
        if (resultLogon.error) {
          node.debug('Komfovent getNode error logging on');
          msg.payload = resultLogon;
          node.send(msg);
        } else {
          let scraped;
          let page = '';
          if (msg.payload.indexOf('_') > 0) { page = '/det.html'; }
          getPage(node, page, function (resultGetPage, body) {
            if (!resultGetPage.error && body !== '') {
              scraped = scraper.load(body);
              msgResult = scraped('#' + msg.payload).text().trim();

              if (typeof msgResult === 'undefined' || !msgResult || msgResult === '') {
                node.warn('Error, id not found: ' + msg.payload);
                msg.payload = { error: true, result: 'id not found', unit: node.komfoUser.ip };
                node.send(msg);
              }
              else {
                // seems like we got the data without errors
                msg.payload = { error: false, result: msgResult, unit: node.komfoUser.ip };
                node.send(msg);
              }
            }
            else {
              node.warn('Komfovent error fetching page: http://' + node.komfoUser.ip);
            }
          });
        }
        return;
      });
    });// end this.on
  } // end komfovent node get

  // function for fetching the page and scrape with cheerio, param page for subpages feature later
  function getPage (node, page, call) {
    request.post({
      url: 'http://' + node.komfoUser.ip + page,
      headers: { }
    },
    function (err, result, body) {
      node.debug('Komfovent -  logon result - Error ' + err);
      if (!err) {
        return call(result, body);
      }
      else {
        node.warn('Error getting page');
        return call({ error: true, result: JSON.stringify(err), unit: node.komfoUser.ip }, '');
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
      node.debug('Komfovent -  logon result - Error ' + err);
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
