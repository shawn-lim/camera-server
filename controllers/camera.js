var exec = require('child-process-promise').exec;
var spawn = require('child_process').spawn;
var isJpg = require('is-jpg');
var q = require('q');

var stream;
var camera_info = {
  model: {
    path: 'cameramodel',
    value: null
  },
  manufacturer: {
    path: 'manufacturer',
    value: null
  }
};
var streamers = {};

exports.getInfo = function(path){
  var deferred = q.defer();
  exec('gphoto2 --get-config '+path)
    .then(function(result){
      deferred.resolve(parseInfo(result.stdout));
    })
    .catch(function(err){
      console.log('ERROR: '+err);
      deferred.reject(err);
    });
  return deferred.promise;
};

exports.getSummary = function(){
  var deferred = q.defer();
  exec('gphoto2 --summary')
    .then(function(res){
      deferred.resolve(parseInfo(result.stdout));
    })
  .catch(function(err){
    console.log('ERROR: '+err);
    deferred.reject(err);
  });
  return deferred.promise;
};

exports.startStream = function(io, cid){
  startStream(io, cid);
};

exports.stopStream = function(cid){
  stopStream(cid);
};

exports.shoot = function(){
  var cmd = spawn('gphoto2', ['--capture-image-and-download']);
  cmd.on('close', function(res){

  });
};
// Starts streaming
function startStream(io, clientid){

  streamers[clientid] = true;

  // Only run this code if the stream is not yet initiated
  if(!stream){
    stream = spawn('gphoto2', ['--capture-movie', '--stdout']);
    console.log('Stream started.');

    stream.stdout.on('error', function(data){
      console.log(data);
    });

    // On data,do stream
    var buffs = [];
    stream.stdout.on('data', function(data){
      /*
       * The frames comes in chunks.
       * The isJpg function checks the first 3 bytes of the array
       * to figure out if the current arraybuffer is the start of a new frame.
       * If so, we concat the previous buffers into 1 image and send it through
       * the socket to all listening clients who's status is 'streaming'
       */
      if(isJpg(data)){
        var b = Buffer.concat(buffs);
        var b64 = base64ArrayBuffer(b);

        var clients = Object.keys(streamers);
        for(var i=0; i<clients.length; i++){
          io.sockets.connected[clients[i]].emit('liveview', b64);
        }
        buffs = [];
        buffs.push(data);
      }
      // Not a new frame, lets push to the buffer
      else{
        buffs.push(data);
      }
    });

    stream.on('close', function(data){
      console.log('Stream stopped.');
    })
  }
};

function stopStream(clientid){
  delete streamers[clientid];
  if(JSON.stringify(streamers).length === 2){
    console.log('No on listening...');
    if(stream){
      console.log('Stopping stream...');
      stream.stdin.pause();
      stream.kill();
      stream = null;
    }
  }
};

/*
 * Sends the camera information to a list of clients
 */
function broadcastCameraInfo(cids){
  
};

/*
 * PARAMS: String response from gphoto2
 * RETURNS: Key-Value map
 */

// String -> Key Value pairmap
function parseInfo(string){
  var keyvals = {};
  var tmp = string.split('\n');
  var choices = [];
  for(var i=0; i<tmp.length; i++){
    var keyval = tmp[i].split(':');
    if(keyval.length > 1){
      if(keyval[0].trim() === 'Choice'){
        choices.push(keyval[1].trim().split(' ')[1].trim());
      }
      else{
        keyvals[keyval[0].trim()] = keyval[1].trim();
      }
    }
  }
  if(choices.length > 0){
    keyvals['choices'] = choices;
  }
  return keyvals;
};

// Array buffer -> Base64 converter
function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
};
