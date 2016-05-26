(function(){

    var fs = require('fs');

    var path = require('path');
    var port = process.env.PORT || 3000;

    var express = require('express');
    var app = express();
    var server = require('http').Server(app);

    var cards = JSON.parse(fs.readFileSync(__dirname + '/list.json', 'utf8'));

    app.use(express.static(path.join(__dirname, '../client')));

    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);

    app.get('/', function(req, res) {
      res.render('index.html');
    });

    app.get('/api/cards', function(req, res) {
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
    });

    server.listen(port, function () {
      console.log('Currently listening on %s', port);
    });

    /* Helpers */

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

})();
