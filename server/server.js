(function(){
  'use strict';

    var path = require('path');
    var port = process.env.PORT || 3000;

    var express = require('express');
    var app = express();
    var server = require('http').Server(app);

    app.use(express.static(path.join(__dirname, '../client')));
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);

    var routes = require('./routes');
    app.get('/', routes.index);
    app.get('/templates/:file', routes.templates);

    var api = require('./api');
    app.get('/api/cards', api.cards);

    var io = require('socket.io')(server);
    io.on('connection', require('./socket'));

    server.listen(port, function () {
      console.log('Currently listening on %s', port);
    });

})();
