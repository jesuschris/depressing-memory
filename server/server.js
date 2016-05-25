(function(){

    var path = require('path');
    var port = process.env.PORT || 3000;

    var express = require("express");
    var app = express();
    var server = require('http').Server(app);

    app.use(express.static(path.join(__dirname, '../client')));

    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);

    app.get('/', function(req, res) {
      res.render('index.html');
    });

    var cards = [
      {
        "title":"Vietnam War"
      },
      {
        "title":"The Holocoust"
      },
      {
        "title":"9/11"
      },
      {
        "title":"Korean War"
      },
      {
        "title":"World War II"
      },
      {
        "title":"World War I"
      },
      {
        "title":"Bombing of Beirut"
      },
      {
        "title":"Death of Princess Diana"
      },
      {
        "title":"San Bernadino Shooting"
      },
      {
        "title":"Newton Masaccre"
      },
      {
        "title":"Assasination of Lincoln"
      },
      {
        "title":"Civil War"
      },
      {
        "title":"A Sad Kitten"
      },
      {
        "title":"A Lonely Puppy"
      },
      {
        "title":"Spilling Your Beer"
      }
    ];

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

    app.get('/api/cards', function(req, res) {
      console.log(req.query.pairs);
      res.json(getRandomUniqueSubset(cards,req.query.pairs));
    });

    server.listen(port, function () {
      console.log("Currently listening on %s", port);
    });

})();
