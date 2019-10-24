var socket = require('socket.io');

let connectedUsers = [];
let searchingUser = [];

const findArray = (array, term) => {
  var index = array.findIndex(function(element) {
    return element.userId === term;
  });
  return index;
}

tratarSocket = () => {
  io = socket(server);

  io.on('connection', (socket) => {
    socket.on('LOGIN', function() {
      socket.userId = Object.keys(connectedUsers).length.toString();
      connectedUsers.push(socket);
      socket.emit('RECEIVE_ID', socket.userId);
    });
 
    socket.on('SEARCHING_CHAT', function(userId){
      if(searchingUser.length === 0) {
        searchingUser.push(userId);
        socket.searching = true;
        socket.emit('SEND_WARNING', 'Searching users');
      } else {
        searchingUser.push(userId);

        socket.emit('FINDED_CHAT', searchingUser[0]);
        const connectedUserIndex = findArray(connectedUsers, searchingUser[0]);
        connectedUsers[connectedUserIndex].emit('FINDED_CHAT', searchingUser[1]);
        socket.chatWith = searchingUser[0];
        connectedUsers[connectedUserIndex].chatWith = searchingUser[1];

        connectedUsers[connectedUserIndex].searching = false;

        searchingUser = [];
      }
    });


    socket.on('SEND_MESSAGE', function(data){
      socket.emit('RECEIVE_MESSAGE', data);
      connectedUsers[findArray(connectedUsers, data.to)].emit('RECEIVE_MESSAGE', data);
    });

    socket.on('disconnect', function(){
      if(socket.chatWith) {
        connectedUsers[findArray(connectedUsers, socket.chatWith)].emit('RECEIVE_MESSAGE', {
          author: socket.userId,
          to: socket.chatWith,
          text: 'USER DISCONNECTED, if desired for another click f5',
        });
      }

      if(socket.searching) searchingUser = [];
      
      connectedUsers.slice(findArray(connectedUsers, socket.userId), 1);
    });
  });
};





module.exports = tratarSocket();
