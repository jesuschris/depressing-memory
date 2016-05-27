(function(){
  'use strict';

  var fs = require('fs');
  
  var getRandomUniqueSubset = function(arr, size) {
      var shuffled = arr.slice(0), i = arr.length, temp, index;
      while (i--) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
      }
      return shuffled.slice(0, size);
  }

  var cards = JSON.parse(fs.readFileSync(__dirname + '/data/list.json', 'utf8'));

  exports.cards = function(req, res) {
    try{
      if(req.query.num > 0 && req.query.num <= cards.length){
        res.json(getRandomUniqueSubset(cards,req.query.num));
      }
      else{
        res.status(400);
        res.json({ 'error': 'cannot provide ' + req.query.num + ' cards' });
      }
    }
    catch(err){
      res.status(500);
      res.json({ 'error': err });
    }
  };

})();
