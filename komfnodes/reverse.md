# History file, reversing and working out Komfovent integration

## Logon - what seems to work best
Komfovent built in webserver for controller C6.

### Confirmed working for logon
	request.post({
      url: 'http://' + node.komfoUser.ip,
      host: node.komfoUser.ip,
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: '1=' + node.komfoUser.credentials.username + '&' + '2=' + node.komfoUser.credentials.password
    },

Komfovent seems to require Host to be present.
Content-type seems to vary, especially the ajax calls are a bit different (naturally)


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

Traffic towards ajax.xml seems to be expected to have host header set, content type of text/plain and connection keep-alive

#### Current setup - not working

	request.post({
      url: 'http://' + node.komfoUser.ip + '/ajax.xml',
      host: node.komfoUser.ip,
      method: 'POST',
      headers: { 'connection': 'keep-alive', 'content-type': 'text/plain' },
      body: mode.code
    }, 