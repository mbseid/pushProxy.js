
var id = id;
var socket = socket;
var rooms = [];
	
function User(id, socket) {
	this.id = id;
	this.socket = socket;
	this.rooms = [];
    if(false === (this instanceof User)) {
        return new User();
    }
}
User.prototype.joinRoom = function( room ){
	this.rooms.push(room);
	this.socket.join(room);
}
User.prototype.leaveRoom = function( room ){
	
}
User.prototype.getRooms = function(  ){
	return this.rooms;
}
User.prototype.rejoinRooms = function() {
    for(var i = 0, l = this.rooms.length; i < l; i++ ){
		this.socket.join(this.rooms[i]);
	}
}

module.exports = User;