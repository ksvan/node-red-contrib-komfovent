'use strict';
/*
Komfovent library for integration with Komfovent units using C6 controller
Based on reverse engineering of web interface ajax calls, not modbus/bacnet even though supported by the unit.
Look at reverse.md for considerations on that design and further details on how stuff works.
All method stateless, no shared global variables in the class

Public functions returns standard json objects with result and error fields as strings, originally made to simplify usage in nodered flows.
Private functions does not, they throw. All functions are async
*/

module.exports = class Komfovent {
  // create at new instance of the class, connected to chosen unit. Remove if ending up useless...
  /* constructor () {
     ;
  } // constructor end
  */

  /* private makeRequest()
  * * generic methog to make the http calls using axios
  * TODO make private function, throw instead of return objects for the flow
  * @param postConfig The config object, axios standard, to make the request.
  */
  async makeRequest (postConfig) {
    // Make a request for logon
    const request = require('axios');
    try {
      const result = await request(postConfig);
      return result;
    }
    catch (error) {
      if (error.response) {
        // server responded something other than http 2xx
        throw new Error('No 200 OK recieved. Status was: ' + error.response.status);
      }
      else if (error.request) {
        // server did not respond
        throw new Error('Unit did not respond: ' + error.request);
      }
      else {
        throw new Error('Unknown error with http request: ' + error);
      }
    } // catch error end
  }

  /* public logon()
  * * function to logon initally
  * TODO: improving detection of logged in state and errors by screenscraping
  * @param username Komfovent username to logon
  * @param password Password for the same user
  * @param ip for the komfovent unit in question
  */
  async logon (username, password, ip) {
    // validate input
    if (typeof username !== 'string' || !username || typeof password !== 'string' || !password) {
      return ({ error: true, result: 'Empty username/password received, quitting' });
    }
    if (typeof ip !== 'string' || !ip) {
      return ({ error: true, result: 'Empty IP received, quitting' });
    }
    const postConfig = {
      url: 'http://' + ip,
      method: 'POST',
      body: '1=' + username + '&' + '2=' + password
    };
    let result;
    try {
      result = await this.makeRequest(postConfig);
    }
    catch (error) {
      return { error: true, result: error.toString() };
    }
    // check that we are actually logged on
    if (result === 'undefined' || result === '') {
      return { error: true, result: 'http request failed' };
    }
    else if (result.data.indexOf('Incorrect password!') >= 0 || result.status > 200) {
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

  /* public etMode()
  * * function to set a mode on the logged on unit. Will not work, but not fail, if not logged on first
  * TODO: future validation that the actual mode was set ok. Better error flow. check what device returns for bad modes
  * @param mode Input object mode{name: 'auto', code: '285=2'}, where code is the values Komfovent expects
  * @param ip address of the komfovent unit to set mode on
  */
  async setMode (mode, ip) {
    // validate input
    if (typeof mode.code !== 'string' || !mode) {
      return ({ error: true, result: 'Empty mode received, quitting' });
    }
    if (typeof ip !== 'string' || !ip) {
      return ({ error: true, result: 'Empty IP received, quitting' });
    }
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
    else {
      return { error: true, result: 'Could not set mode. Non existing? ' + mode.name };
    }
  } // setmode end

  /* private getMode()
  * * Function to fetch currently active mode
  * TODO fix attrib scan from scraper and find text value of active mode
  * @param ip ip of the unit to fetch mode status from
  */
  async getMode (ip) {
    // no validate input, private
    try {
      const scraped = await this.getData('data', ip);
      const msgResult = scraped('div[data-selected="1"]').innerText();// ('div.control-1'); // .attr('data-selected');
      console.dir(msgResult);
      if (typeof msgResult === 'undefined' || !msgResult) {
        return { error: true, result: 'Active mode not found', unit: ip };
      }
      else {
        // seems like we got the data without errors
        return { error: false, result: msgResult, unit: ip };
      }
    }
    catch (error) {
      return { error: true, result: 'Could not fetch data for mode: ' + error };
    }
  } // getMode end

  /* private getData()
  * * private function to fetch data from the different komfovent views
  * TODO
  * @param name Name of the datafield to fetch. IDs defined in C6 web setup, documented in README and reverse.md
  * @param ip IP address of the unit to fetch from
  * @return cherio object for query of scraped content
  */
  async getData (name, ip) {
    // no validate input, private only
    // change target to subpage if identity/name
    const page = name.indexOf('_') > 0 ? 'det.html' : '';
    // setup for get request
    const getConfig = {
      url: 'http://' + ip + '/' + page,
      method: 'GET'
    };
    // get the page and scrape it
    const result = await this.makeRequest(getConfig);
    // validate results before parsing
    if (result !== 'undefined' && result && !result.error && result.data) {
      // load scraper and scrape recieved content
      const scraper = require('cheerio');
      const scraped = scraper.load(result.data);
      return scraped;
    }
    else {
      throw new Error('Could not fetch page: ' + result.result);
    }
  } // getData end

  /* public getId()
  * * public function to fetch the different data id values from the web pages
  * TODO
  * @param Name of the datafield to fetch. IDs defined in C6 web setup, documented in README and reverse.md
  */
  async getId (name, ip) {
    // validate input
    if (typeof name !== 'string' || !name) {
      return ({ error: true, result: 'Empty ID recieved, quitting' });
    }
    if (typeof ip !== 'string' || !ip) {
      return ({ error: true, result: 'Empty IP recieved, quitting' });
    }
    try {
      const scraped = await this.getData(name, ip);
      const msgResult = scraped('#' + name).text().trim();
      if (typeof msgResult === 'undefined' || !msgResult) {
        return { error: true, result: 'ID not found', unit: ip };
      }
      else {
      // seems like we got the data without errors
        return { error: false, result: msgResult, unit: ip };
      }
    }
    catch (error) {
      return { error: true, result: 'Could not fetch data: ' + error };
    }
  } // getId end
};
