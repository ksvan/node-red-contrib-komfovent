module.exports = function (RED) {
  'use strict';
  function komfoventConfig (config) {
    RED.nodes.createNode(this, config);
    // var node = this;
    this.username = config.username;
    this.password = config.password;
    this.ip = config.ip;
    // komfovent ajax values to pass for the modes
    var mode = {
      home: '3=2',
      away: '3=1',
      auto: '285=2',
      intensive: '3=3',
      boost: '3=4'
    };
    this.mode = mode;
  }
  RED.nodes.registerType('komfoventConfig', komfoventConfig, {
    credentials: {
      username: { type: 'text' },
      password: { type: 'password' }
    }
  }
  );
};
