var express = require('express');
var router = express.Router();
var imageService = require('../services/image_service.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* temp and probably not very useful api to upload images */
router.post('/images', function(req, res, next){
    if (!req.body.name || !req.body.path){
        res.status(400).send("name and path cannot be empty");
        return ;
    }
    imageService.createImage(req.body.name, req.body.path);
    res.status(204);
});

module.exports = router;

