'use strict';
/*
Komfovent library for integration with Komfovent units using C6 controller
Based on reverse engineering of web interface ajax calls, not modbus/bacnet even though supported by the unit.
Look at reverse.md for considerations on that design and further details on how stuff works
*/

export default class Komfovent {
  // create at new instance of the class, connected to chosen unit. Remove if ending up useless...
  constructor () {

  } // constructor end

  /* makeRequest()
  * * generic methog to make the http calls using axios
  * @param postConfig The config object, axios standard, to make the request.
  */
  async makeRequest (postConfig) {
    // Make a request for logon
    const request = require('axios');
    try {
      const result = await request(postConfig);
      return result;
    }
    catch (err) {
      if (err.errno === 'ENOTFOUND' || err.errno === 'EHOSTDOWN') {
        return { error: true, result: err };
      }
      else {
        return { error: true, result: err };
      }
    } // catch error end
  }

  /* logon()
  * * function to logon initally
  * TODO: improving detection of logged in state and errors by screenscraping
  * @param username Komfovent username to logon
  * @param password Password for the same user
  * @param ip for the komfovent unit in question
  */
  async logon (username, password, ip) {
    const postConfig = {
      url: 'http://' + ip,
      method: 'POST',
      body: '1=' + username + '&' + '2=' + password
    };
    const result = this.makeRequest(postConfig);
    // check that we are actually logged on
    if (result.data.indexOf('Incorrect password!') >= 0 || result.status > 200) {
      return { error: true, result: 'Wrong password for unit' };
    }
    else if (result.data.indexOf('value="Logout') >= 0 && result.status === 200) {
      // then assume we are logged on correctly
      return { error: false, result: 'logged on' };
    }
    else {
      // seems like something unknown failed, the beauty of screenscraping
      return { error: true, result: 'Something totally unknown happened with logon' };
    }
  }// logon end

  /* setMode()
  * * function to set a mode on the logged on unit. Will not work, but not fail, if not logged on first
  * TODO: future validation that the actual mode was set ok
  * @param mode Input object mode{name: 'auto', code: '285=2'}, where code is the values Komfovent expects
  * @param ip address of the komfovent unit to set mode on
  */
  async setMode (mode, ip) {
    // defining message needed by c6 to switch modes
    const postConfig = {
      url: 'http://' + ip + '/ajax.xml',
      method: 'POST',
      body: mode.code
    };
    // make request for mode change
    const result = await this.makeRequest(postConfig);
    if (result.status === 200 && result.data.indexOf('c6') > 0) {
      // then assuming it was ok, right http and the weird standard body response from C6 controller
      return { error: false, result: mode.name };
    }
  } // setmode end

  // function to fetch mode
  async getMode () {

  } // getMode end

  /* getData()
  * * function to fetch data points from the different komfovent views
  * TODO
  * @param name Name of the datafield to fetch. IDs defined in C6 web setup, documented in README and reverse.md
  */
  async getData (name) {

  } // getData end
}
