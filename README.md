#pushProxy.js - v0.1

##Goal
The goal is to create a language neutral push system.  By exposing a very simple RESTful API, we will create a powerful and flexible interface that will provide real time communication.

###Technical Stuff
This is a node.js application that takes advantage of the awesome socket.io package.  It is extremely powerful and very flexible. I also use Journey to provide simple routing to create the API.  There is no html served ever.  

node.js - http://nodejs.org/ 
socket.io - https://github.com/LearnBoost/socket.io
journey - https://github.com/cloudhead/journey --This is a custom version.  Please use the one in the repo.

 
###Current Version
v0.1: COMPLETE - Allow a user to register, and provide an API to send messages with a custom payload.

###Roadmap
* v0.1: COMPLETE - Allow a user to register, and provide an API to send messages with a custom payload.
* v0.15: Add better response for each rest call.  Return some useful information.
* v0.2: Chat room functionality.  This will allow users to subscribe to a room and also receive room specific broadcasts
* v0.3: Security.  Add heavy security to facility server2server communication and facility some way to verify users authenticity.
* v0.4: Different Message Types.  This will simply the message handling on the javascript side


##Usage

###Simple Sample
Here is a simple example of what pushProxy.js can do.  Backend sample written in ColdFusion

Start pushProxy
```shell
sudo node pushProxy.js
```

Client side code
```javascript
<script src="http://localhost:8080/socket.io/socket.io.js"></script>
<script>
	//Connect to socket.io
	var socket = io.connect('http://localhost:8080');
	socket.on('connect', function (data) {
    	socket.emit('register', { userId: #userId# });
	});
	socket.on('message', function(data){
		//This is your handler.  All messages come in via a message right now.
		//I use a generic window call
		window[data.method].apply(this, data.arguments)
	})
</script>
```

Back end code
```coldfusion
<cfscript>
payload = {
	 'userId' = 1,
	 'data' = {
	 	'method' = 'foobar',
		'arguments' = {
				'roomId' = 1
			}
	 	}
	};
</cfscript>
<cfhttp name="call" result="test" url="http://localhost/command" method="POST" port="8080" resolveurl="yes">
	<cfhttpparam type="FORMFIELD" name="command" value="send">
	<cfhttpparam type="FORMFIELD" name="data" value="#SerializeJSON(payload)#">
</cfhttp>
<cfdump var="#DeserializeJSON(test.filecontent)#" />
```

Please note that for format of the payload and the command in the post.
* The command in the post notifies pushProxy that it it wants to push.  This is the only command right now.
* The payload for the send command must have the userId key in the json struct.  The userId could be a string or number.  It just has to match the userId sent in the register function.
* I use the data to invoke the proper action with the arguments.  This is completely up you to you though.



##License
I have released this under the MIT License.  Feel free to use and contribute.
