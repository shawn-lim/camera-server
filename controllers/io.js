var socket = require('socket.io');
var camera = require('./camera');
var stream = null;

var clients = {};

module.exports.listen = function(app){
  var io = socket.listen(app);

  io.on('connection', function(client){
    //TODO: Establish some form of client authentication handshake

    // Successfull authenication
    clients[client.id] = {};
    var cids = Object.keys(clients);

    console.log('Client with ID: ' + client.id + ' connected.');
    console.log(cids.length + ' clients currently connected.');

    // Upon disconnect, remove client
    client.on('disconnect', function(){
      removeClient(client.id);
    });

    client.on('liveview:start', function(){
      camera.startStream(io, client.id);
    });
    client.on('liveview:stop', function(){
      camera.stopStream(client.id);
    });
  });

  return io;
};

var removeClient = function(clientid){
  delete clients[clientid];
  stopStream(clientid);
};
