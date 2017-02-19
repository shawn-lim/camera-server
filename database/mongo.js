var mongoClient = require('mongodb').MongoClient;
var database = require('./database.js');
var inherits = require('util').inherits;

function MongoDatabase(){
    Database.call(this);
    this.connectionString = 'mongodb://localhost27017/camera_server';
}


