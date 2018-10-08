module.exports = function (RED) {
  'use strict';
  function komfoventConfig (config) {
    RED.nodes.createNode(this, config);
    // var node = this;
    this.username = config.username;
    this.password = config.password;
    this.ip = config.ip;
    this.displayName = config.displayName;
    this.siteName = config.siteName;
    // komfovent ajax values to pass for the modes (fireplace and kitchen must be supplied with timer values 283=80 for 80 mins run tim)
    var mode = {
      home: '3=2',
      away: '3=1',
      auto: '285=2',
      intensive: '3=3',
      boost: '3=4',
      fireplace: '283',
      kitchen: '282'
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
