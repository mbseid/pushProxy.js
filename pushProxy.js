//This guy is inteneded to map a "User Id" to socket io session Id.  Usefull for our api
var userManager = require("./userManager");
var utils = require("./utils");

function sendMessage(userId, data){
	var socket = userManager.getUser( userId );
	socket.emit('message', data);
}

function createRoom(room, users){
	for(var i = 0,  l = users.length; i < l; i ++){
		var socket = userManager.getUser(users[i]);
		socket.join(room)
	}
}

function sendRoomMessage(room, username, message){
	io.sockets.in(room.toString()).emit('roomMessage', {room: room, username: username, message: message});
}

//Now so we can communicate with other web services
var journey = require('journey'),
	http = require('http');

var router = new(journey.Router);

router.map(function () {
    this.root.bind(function (req, res) { res.send("Welcome") });
    router.get('/test').bind(function (req, res, params){
    	res.send(200, {}, "Success");
    });
    router.post('/command').bind(function (req, res, params) {
    	var data = JSON.parse( params.data );
    	console.log(params.command);
    	console.log(utils.dump(data));
    	switch(params.command){
    		case "send":
    			sendMessage(data.userId, data.data);
    			res.send(200, {}, {success:true});
    			break;
    		case "createRoom":
    			createRoom(data.room, data.users);
    			res.send(200, {}, {success:true});
    			break;
    			
    	}
	});
});

var api = http.createServer(function (request, response) {
    var body = "";

    request.addListener('data', function (chunk) { body += chunk });
    request.addListener('end', function () {
        //
        // Dispatch the request to the router
        //
        router.handle(request, body, function (result) {
            response.writeHead(result.status, result.headers);
            response.end(result.body);
        });
    });
});

api.listen(8080);
//Bellow is the socket io magic, love this tuff
var io = require('socket.io').listen(api);

io.sockets.on('connection', function (socket) {
	socket.on('register', function (data) {
		console.log("Regiser: " + data.userId + " , " + socket.id);
		userManager.addUser(data.userId, socket);
	});
	
	socket.on('room', function( data ){
		sendRoomMessage(data.room, data.username, data.message)
	});
	
	socket.on('disconnect', function (data) {
		userManager.removeUser(socket.id);
     });
});
