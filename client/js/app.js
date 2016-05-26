
/* Global */

var shuffleCards = function(cards) {
  var ci = cards.length, ri, temp;
  while (0 !== ci) {
    ri = Math.floor(Math.random() * ci);
    ci -= 1;
    temp = cards[ci];
    cards[ci] = cards[ri];
    cards[ri] = temp;
  }
  return cards;
}

/* App */

var app = angular.module('DepressingMemory', ['ngMaterial'])
  .factory('appState', function () {
      //Observer pattern
      var _observers = [];

      var difficultyLevels = [
        {
          "title" : "Easy",
          "pairs" : 6,
          "timeLimit" : 60000
        },
        {
          "title" : "Normal",
          "pairs" : 12,
          "timeLimit" : 120000
        },
        {
          "title" : "Hard",
          "pairs" : 18,
          "timeLimit" : 240000
        }
      ];
      var difficulty = difficultyLevels[0];

      var updateObservers = function(message){
        angular.forEach(_observers, function (callBack) {
            callBack(message);
        });
      }

      return {
        observe: function (callBack) {
          _observers.push(callBack);
        },
        getDifficulty: function() {
            return difficulty;
        },
        getDifficultyLevels: function() {
            return difficultyLevels;
        },
        setDifficulty: function (value) {
          difficulty = value;
          updateObservers("difficulty");
        }
      };
  });

/* Controllers */

app.controller("CardsAreaController", function($scope, $window, $http, $timeout, appState) {

  $scope.isReady = false;
  $scope.isPlaying = false;
  $scope.canFlip = false;

  $scope.matchedPairs = 0;

  $scope.cards = [];
  $scope.pendingCard = null;

  $scope.flipCard = function(card){
    if($scope.isReady && $scope.isPlaying && $scope.canFlip){
      if(!card.isFlipped){
        //Flip the card
        card.isFlipped = true;
        if($scope.pendingCard !== null){
          //Check if the card matches our pendingCard
          if($scope.pendingCard.title === card.title){
            //We've got a match
            $scope.matchedPairs++;
            $scope.pendingCard = null;
          }
          else{
            $scope.canFlip = false;
            //Flip both back over
            $timeout(function() {
              card.isFlipped = false;
              $scope.pendingCard.isFlipped = false;
              $scope.pendingCard = null;
              $scope.canFlip = true;
            }, 1000);
          }
        }
        else{
          //Set this card as our pendingCard
          $scope.pendingCard = card;
        }
      }
    }
  }

  $scope.$watch(function(){
    return $window.innerWidth;
  }, function(value) {
    console.log(value);
  });

  angular.element($window).bind('resize', function(){
    $scope.$apply();
  });

  var getCards = function(pairs){
    $http({
      url: "api/cards",
      method: "GET",
      params: { pairs: pairs }
    })
      .then(function(res){
        var data = res.data;
        var cards = [];
        for(i in data){
          var card = data[i];
          card.isFlipped = false;
          card.words = card.title.split(' ');
          var longestWord = 0;
          angular.forEach(card.words,function(word){
            if(word.length > longestWord){
              longestWord = word.length;
            }
          })
          if(longestWord > 16){
            card.fontSize = "0.6em";
          }
          else if(longestWord === 16){
            card.fontSize = "0.65em";
          }
          else if(longestWord === 15){
            card.fontSize = "0.7em";
          }
          else if(longestWord === 14){
            card.fontSize = "0.75em";
          }
          else if(longestWord === 13){
            card.fontSize = "0.8em";
          }
          else if(longestWord === 12){
            card.fontSize = "0.85em";
          }
          else if(longestWord === 11){
            card.fontSize = "0.9em";
          }
          else if(longestWord === 10){
            card.fontSize = "0.95em";
          }
          else{
            card.fontSize = "1em";
          }
          cards.push(card);
          var cardCopy = {};
          angular.extend(cardCopy, card);
          cards.push(cardCopy);
        }
        cards = shuffleCards(cards);
        $scope.cards = cards;
        $scope.isReady = true;
        $scope.isPlaying = true;
        $scope.canFlip = true;
      })
      .catch(function(err){
        console.log(err);
      });
    };

    appState.observe(function(message){
      if(message === "difficulty"){
        getCards(appState.getDifficulty().pairs);
      }
    });

});

app.controller("SidebarController", function($scope, appState) {

  $scope.difficultyLevels = appState.getDifficultyLevels();
  $scope.difficulty = appState.getDifficulty();

  $scope.updateDifficulty = function(){
    appState.setDifficulty($scope.difficulty);
  }

});

/* Directives */

/* Filters */
