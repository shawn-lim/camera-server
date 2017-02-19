var exports = module.exports = {};
var mongoClient = require('mongodb').MongoClient;

exports.createImage = function(imageName, imagePath){
    mongoClient.connect('mongodb://localhost:27017/images', function(err, db){
        if (err) {
            console.log(err);
            throw err;
        }

        db.collection('images').insertMany([{name: imageName,
                                             path: imagePath}], function(err, result){
                                                 if (err) {console.log(err);}
                                                 console.log("lalala inserted");
                                             });
    });
}
