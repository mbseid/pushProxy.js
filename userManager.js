( function() {
	var userList = {};

	module.exports.addUser = function (userId, socket) {
		userList[String(userId)]  = socket;
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