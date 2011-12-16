( function() {
	var User = require('./user');
	var userList = {};

	module.exports.addUser = function (userId, socket) {;
		var user = userList[String(userId)];
		if(user != null){
			user.socket = socket;
			user.rejoinRooms();
		}else{
			userList[String(userId)] = new User(userId, socket);
		}
	}
	module.exports.removeUser = function (sessionId) {
		for( var key in userList ) {
			if(userList[key] == sessionId) {
				delete userList[key];
				break;
			}
		}
	}
	module.exports.getUser = function ( userId ){
		return userList[String(userId)];
	}
	
	
}());