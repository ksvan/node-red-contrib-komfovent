# Node-red-contrib-komfovent
This package contains nodes to work with Komfovent ventilation units, mainly with the C6 controller with built in webserver.
The node supports the (way too basic) web auth for this unit and uses the ajax calls to integrate.

This package is by no means associated with or supported by the actual vendor of the ventilation units, but should be perfectly safe to use, as it only replicates the exact actions of the web based controller.

# To install

	npm install node-red-contrib-komfovent

or clone/download and use/modify it yourself. After download, switch to your .node-red folder and

	npm link <path to package>

You can then edit and work on it, all changes available in node-red with just a restart (node-red-stop & node-red-start)

# Nodes
## Config
This node basically contains your credentials and the config values the other nodes will use for sending commands.
the values Komfovent accepts for the different modes are stored here, as of now not available from config.

## KomfoventNode (set mode)
This is the first action node, that will let you activate the different modes of the unit.

	Auto - The unit will either follow the chosen program (workweek etc) or manage speed based on sensors if installed (humidity, temp)
	Away - Usually a low intensity mode, based on your settings
	Normal - the setting for operating normally when at home. Should have been calibrated by your installation vendor
	Intensive - for hot days or extra people in the house, fans at higher speeds
	Boost - for when you really need to exchange that air

Please note that in the C6 webcontroller, the Auto and Eco modes are toggle switches. If you call it once, auto mode is activated. Twice, and it falls back to last known standard mode (away, normal etc). 

### Input and results 
The node takes strings as input, the name of the wanted operating mode.
	
	msg.payload = 'intensive';

Return values are either the mode if success, or the error returned. (add error value info)

	{ error: true, result: 'wrong password', unit: 192.168.x.x }
	{ error: false, result: 'auto', unit: 192.168.x.x }
	{ error: false, result: '16.6', unit: 192.168.x.x } // (future release with property extraction, ie outside temperature etc)

Result can also be stringified error object from Request.post, on errors not handled specifically by this node.


## Future
Add support for more modes (fireplace, kitchen ventilation etc)
Future plan is to add getting the values from the unit as well, but that kind of screen scraping isn't to motivating...
Surfarcing the actual commands sent in the config node might also be relevant in the future.
Maybe adding support for specifically handling the modes implemented as toggle switches (auto, eco) and remove the toggle issue of the controller. But this has multiple quality/troubleshooting implications and would require scraping actual data from the controller first.

## Handling toggle switches
Auto and eco mode is toggling the modes when called. If you call it once, auto mode is activated. Twice, and it falls back to last known standard mode (away, normal etc). This can be handled quite easily in node-red. Make a global context variable tracking if you have called it or not and use a switch or function node to implement your logic. My function node for this in an earlier implementation:

	if (global.get("autoIsSet") && msg.payload =="285=2") {
    	msg = null;
    	// do not call twice, value is toggling the controller mode
    	node.status({text:"Already set intense - stop"});
	}
	else if (!global.get("autoIsSet") && msg.payload == "285=2") {
    	global.set("autoIsSet",true);
    	//call and flag not to call it twice
    	node.status({text:"Setting intense - flag"});
	}
	else {
    	global.set("autoIsSet", false);
    	node.status({text:"Intense flag false"});
	}
	return msg;

# Security
The basic and not very trustworthy security of the unit means that you should take care when integrating witt and exposing it. Never put it directly online, integrate locally or secure your communications and terminate it as close to the unit as possible.
Please not that the units c6 controller does not support SSL/TLS. Do make sure that you do not reuse a password from your other services or IoT devices etc.

# Troubleshooting
Due to the annoying nature of ventilation systems and their lacking capabilities in digitalization, there is a lot more debug output from this node than I would usually add. To use it, run node-red -debug

Most errors will be surfaced in the returned json structure and the most common ones is handled specifically (wrong password, host not found).

The node is tested against the C6 controller running 1.3.14.14 firmware, being a bit inconsistent in logon and having issues setting mode.
Main part of the work has been done with the newer 1.3.17.20 firmware. See the komfovent.com webpage for end users and downloads to find the newest firmware and instructions on how to update. (Download the bin file, turn of the fan, go to http://yourunit/g1.html, upload bin file and wait. Mind that if you are fare behind, there could be intermediate upgrades to go through first.)

The units built in webserver handles auth by receiving the body of 1=username&2=password. The system will return HTTP 200 even when auth fails, just hihglighting "incorrect password" in the page sent back.
Mode is set by posting to the ajax.xml file, with a body of for instance 3=1, 3=2 etc. Note that Automode is called by 285=2, but this is a toggle switch. Calling it twice will have the system go back to the last mode activated.
In automode, the system will alter fanspeed based on either sensors or the weekly plan you have defined.

Please note that timeouts can be long for wrong or not reachable hosts, as this would be defined by the OS TCP/IP timeout settings.

# Legal Disclaimer

This software is not affiliated with Komfovent and the developers take no legal responsibility for the functionality or security of your ventilation systems and devices. Neither does any of the contributers/dependecies to this package. Treat your credentials with the uthermost care.



