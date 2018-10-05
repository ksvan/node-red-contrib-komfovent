# History file, reversing and working out Komfovent integration
My own documentation of results during reversing, sniffing, trial and error. 

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
Content-Length though seems to be case sensitive and should come before	host and other headers...

### Switching modes for komfovent
This is done by reusing the ajax calls made by the webclient, towards a file at root called ajax.xml
File returns a small xml saying the controller version and http 200 seemingly anyways. This does not however indicate that the command will be executed.

	<?xml version="1.0" encoding="windows-1252"?>
	<V>
		<A>c6</A>
	</V>
Commands are simple payloads, form look a like formatting.

	3=2 or 285=2
285 is the automode, which in the webserver is handled as a toggle switch. Calling it once will set in Auto mode, twice will reset to the last fan mode before auto. 

Traffic towards ajax.xml seems to be expected to have host header set, content type of text/plain and connection keep-alive. But seems to be more stable without any other headers set in request() than case sensitive Content-Length

#### Current setup - working

	request.post({
      url: 'http://' + node.komfoUser.ip + '/ajax.xml',
      // headers: { 'Connection': 'Keep-Alive', 'Content-Type': 'text/plain;charset=UTF-8', 'Origin': 'http://' + node.komfoUser.ip },
      headers: { 'Content-Length': mode.code.length },
      body: mode.code
    } 


## Scraping info from the page


