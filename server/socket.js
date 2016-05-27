(function(){
  'use strict';

  module.exports = function (socket) {
    console.log('hello ' + socket.id);
    socket.on('disconnect', function () {
      console.log('goodbye ' + socket.id);
    });
  };

})();
