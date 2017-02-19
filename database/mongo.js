var mongoClient = require('mongodb').MongoClient;
var Database = require('./database.js');
var inherits = require('util').inherits;

function MongoDatabase(){
    Database.call(this);
    this.connectionString = 'mongodb://localhost27017/camera_server';
    this.name = "name: mongo";

    
    var db = {};

    db.__proto__ = Database();

    db.exec = function(fn){
        mongoClient.connect(this.connectionString, function(err, db){
            if (err){
                console.log(err);
                throw err;
            }

            fn(db);
        });
    };


    db.images.create = function(){
        console.log("create iamge");
        console.log(this.name);
//        var db;
        
    }
}

module.exports = MongoDatabase;
