(function(){
  'use strict';

  exports.index = function(req, res) {
    res.render('index.html');
  };

  exports.templates = function(req, res){
    var file = req.params.file;
    if(!file){
      res.status(404);
      res.send('404');
    }
    res.render("templates/" + file );
  };

})();
