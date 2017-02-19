var exports = module.exports = {};
var Mongo = require('../database/mongo.js');

exports.createImage = function(imageName, imagePath){
    var db = new Mongo();
    db.images.create(imagePath, imageName);
}
