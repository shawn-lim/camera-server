var express = require('express');
var router = express.Router();


var loadImage = function(req, res, next){
  req.image = req.db.collection('images').findOne({_id: req.params.id});
  next();
}

router.get('/', function(req, res, next){
  var result = req.db.collection('images').find().toArray();//function(err, result){
    // if (err) {
    //   console.log("result" + result);
    //   console.log(err);
    //   throw err;
    // }
    // res.write(result);
  // });
  res.write(result);
});


router.get('/:id', loadImage, function(req,res,next){
  res.send(req.image);
});

router.post('/', function(req, res, next){
  var image = {};
  image.url = req.body.url;
  req.db.collection('images').insertOne(image, function(err, inserted){
    res.send(inserted);
  });
  
});


router.put('/:id',loadImage, function(req,res, next){
  next();
});

router.put('/:id/monochrome', function(req,res,next){
  res.send(req.image);
});

module.exports = router;
