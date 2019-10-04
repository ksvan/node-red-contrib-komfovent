# History file, reversing and working out Komfovent integration
My own documentation of results during reversing, sniffing, trial and error. 

## Reversed
- What: Komfovent ventilation aggregate with C6 controller (fw 1.3.17.20 latest reversed and verified)
- Purpose: for smarthome integration via nodered
- Protocol: HTTP/TCP
- Method: Reuse ajax calls to trigger actions, scrape pages for information
- Security: Next to non existing, simple unsecured logon

### Considerations
Done before: not for this specific use case. But screen scraping in general is highly solved and reusable as tactic.

Alternatives: modbus or bacnet integration. Seems like hard to use and low quality in existing libs. Old school protocol gone TCP, not easily available good documentation from vendor, seems ro rely on electrican domain knowledge in addition. REST apis would be good, ajax calls gives kind of the same for setting config. Fetching values is worse, screen scraping. 

Going modbus would be a logical level below, requiring more understanding of the aggregate/machinery etc, not to get unexpected results from different value combinations. This is handled by C6 web logic and should reside on the system side, not withing my code. 
Looked into the ios app they provide, this is implemented with modbus, so not interesting as such. Also provides less datapoints than the web.

### How
For the most part using Chrome dev tools and wireshark to decompose the pages and calling structure.
Wireshark to compare real traffic with what I can generated with node.js request, make them similar.
Trial and error, figuring out what matters for the server on the C6 controller, trying to get to the bare minimum needed to mimic the right interaction, as little as possible that could go wrong with future firmware C6 updates and maintenance needs on my side.

## Logon - what seems to work best
Komfovent built in webserver for controller C6.

### Confirmed working for logon
	request.post({
      url: 'http://' + node.komfoUser.ip,
      headers: { 'Content-Length': 17 },
      body: '1=' + node.komfoUser.credentials.username + '&' + '2=' + node.komfoUser.credentials.password
    },

Komfovent seems to require Host to be present.
Content-type seems to vary, especially the ajax calls are a bit different (naturally). But seems to work best without setting the headers.
Content-Length though seems to be case sensitive and should come before	host and other headers... varies how the standard libs handles this. For axio it seems fine to let lib handle that part.

### Switching modes for komfovent
In komfovent's world they separate between to concepts quite similar from an enduser point of view.
- Operation mode - which is really static modes on speeds, temperature etc
- Operation control (mode) - which is a more dynamic plan, where speed, heating etc is set based on sensors and/or weekly schedules

This is done by reusing the ajax calls made by the webclient, towards a file at root called ajax.xml
File returns a small xml saying the controller version and http 200 seemingly anyways. This does not however indicate that the command will be executed.

	<?xml version="1.0" encoding="windows-1252"?>
	<V>
		<A>c6</A>
	</V>
Commands are simple payloads, form look a like formatting.

	3=2 or 285=2
285 is the auto control, which in the webserver is handled as a toggle switch. Calling it once will set in Auto mode, twice will reset to the last fan mode before auto. 

Traffic towards ajax.xml seems to be expected to have host header set, content type of text/plain and connection keep-alive. But seems to be more stable without any other headers set in request() than case sensitive Content-Length

#### Modes with timeouts
These modes are only accepting a timeout value in minutes as the value. 283 is fireplace, 282 is kitchen ventilator mitigation

	283=80
This would activate Fireplace for 80 minutes.

#### Current setup - working

	request.post({
      url: 'http://' + node.komfoUser.ip + '/ajax.xml',
      // headers: { 'Connection': 'Keep-Alive', 'Content-Type': 'text/plain;charset=UTF-8', 'Origin': 'http://' + node.komfoUser.ip },
      headers: { 'Content-Length': mode.code.length },
      body: mode.code
    } 
body then beeing ie 283=80

### Modes

	var mode = {
      home: '3=2',
      away: '3=1',
      auto: '285=2',
      intensive: '3=3',
      boost: '3=4',
      fireplace: '283',
      kitchen: '282'
    };

## Scraping info from the page
Komfovent C6 controller webpage isnt very human readable formatted, but at least there is unique IDs for key elements to adress them when scraping.
To get the main page, you just get the root of the webserver again after logon.

The page calls ajax.xml to post changes. 
- i.asp seems to be the one outputting the values, in sort of an xml format for key details like pressure, indoor temp etc.
- det.asp seems similar, but other data fields.
- st.html is the settings page.
- det.html is the formatted page for detailed data, consuming det.asp data.
- c_cfg.html is the settings page for the modes.
- c_cfg2.html is the settings page for operation controls.

### ID, Field names
Not all fields are in/from the same page, which parsers like cheerios have issues with. Main page of komfovent uses several iframes.
In general, all fields without underscores seems to be available on main page (current hypotheses). Needs to fetch the subpages directly and find some consistency in the IDs with regards to what page they belong in.

#### Temperature and heating
- ai0 is supply temperature
- ai1 is extract temperature
- ai2 is outdoor temperature
- ec2 is current heat recovery in watts
- v_eh is heater operating level %
- ec4 is current heating power in watts
- ec1 is current heat exchanger effecieny in %
- ec7d is kWh spent on heating for current day. ec7m is for month and ec7t total

#### Pressure
- saf is suppy flow in percentage
- eaf is extract airflow in percentage

#### Humidity
- rh is relative humidity in percentage
- v_s1 is sensor 1 humidity if present %
- v_s2 is sensor 2 humidity if present %
- v_ph1 is panels humidity level %

#### Other sensors and metrics
- fcg is filter clogging level %
- v_ad is air dampers %

#### Energy metrics
- v_es is energy saving level
- ec3 is current power consumption
- ec8d is recovered energy in kWh current day. ec8m for month, ec8t total
- ec6d is consumed energy in kWh for the day. ec6m for month and ec6t for total

#### Operations
- om-1 is away mode
- om-2 is normal mode
- om-3 is intensive mode
- om-4 is boost mode
- om-5 is kitchen mode (timed)
- om-6 is fireplace mode (timed)
- om-7 is override mode (timed)
- om-8 is holidays (timed, date intervall)
- oc-1 is eco control mode
- oc-2 is auto control mode
- omo is current operational level of the fan, also in case of running auto

#### Operations schedules
- so-2 is woorking week
- so-1 is stay at home
- so-3 is office
- so-4 is custom schedule

#### Field naming conventions
IDs with _ seems to be gathered at the det.html page.
so-x fields are shown with a property data-selected="1" is currently active, but no property if not active.
om-x fields are shown with a property data-selected="1" is currently active, but no property if not active.
oc-x fields are shown with the same property if selected, but also set to 0 if not active.




