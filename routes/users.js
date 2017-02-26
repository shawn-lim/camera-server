var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/images', function(req, res, next){
  var result = req.db.collection('images').find().toArray(function(result, err){
    if (err) {
      res.send(err);
      throw err;
    }
    res.send(result);
  });
});

router.post('/images', function(req, res, next){
  req.db.collection('images').insertOne(req.body);
  res.send(200);
});

module.exports = router;
