app.controller("AppController", function($scope, appState, socket){


});

app.controller("PageController", function($scope, $window){
  var setWH = function(){
    $scope.width = $window.innerWidth + "px";
    $scope.height = $window.innerHeight + "px";
    //console.log($scope.width + " x " + $scope.height);
  };
  angular.element($window).bind('resize', function(){
    setWH();
    $scope.$apply();
  });
  setWH();
});

app.controller("SetupMenuController", function($scope, $state, $interval, $timeout, appState) {

  $scope.cards = [
    {"text":"depressing","isFlipped":false},
    {"text":"memory","isFlipped":false},
    {"text":".com","isFlipped":false},
  ];

  var currentTitleCard = 0;
  var flipTitleCard = function() {
    if(currentTitleCard >= $scope.cards.length){
      currentTitleCard = 0;
    }
    var card = $scope.cards[currentTitleCard];
    card.isFlipped = !card.isFlipped;
    currentTitleCard++;
  }
  var flipCardsSequence = function(timeBetweenFlips) {
    flipTitleCard();
    $timeout(function(){
      flipTitleCard();
    },timeBetweenFlips);
    $timeout(function(){
      flipTitleCard();
    },timeBetweenFlips*2);
  }

  $timeout(function(){
    flipCardsSequence(200);
    $interval(function(){
      flipCardsSequence(500);
      $timeout(function(){
        flipCardsSequence(50);
      },2000);
    }, 5000);
  },500)

  $scope.difficultyLevels = appState.getDifficultyLevels();
  $scope.difficulty = appState.getDifficulty();

  $scope.name = "Chris";

  $scope.startGame = function(type){
    if(type === "solo" || type === "paired"){
      appState.setDifficulty($scope.difficulty);
      appState.setIsUserSetup(true);
      $state.go("game");
    }
  }
});

app.controller("CardsAreaController", function($scope, $state, $window, $http, $timeout, appState) {

  var setFontSize = function(){
    if($window.innerWidth >= $window.innerHeight){
      if($window.innerWidth >= 765){
        //Bigger landscape... make font a little bigger!
        $scope.fontSize = (1.5 * ($window.innerWidth / 100)) + "px";
      }
      else{
        //Small andscape... make font small!
        $scope.fontSize = (2 * ($window.innerWidth / 100)) + "px";
      }
    }
    else{
      $scope.fontSize = (2.5 * ($window.innerWidth / 100)) + "px";
    }
  };

  angular.element($window).bind('resize', function(){
    setFontSize();
    $scope.$apply();
  });
  setFontSize();

  $scope.isReady = false;
  $scope.isPlaying = false;
  $scope.canFlip = false;

  $scope.matchedPairs = 0;

  $scope.cards = [];
  $scope.pendingCard = null;

  $scope.flipCard = function(card){
    if($scope.isReady && $scope.isPlaying && $scope.canFlip){
      if(!card.isFlipped){
        card.isFlipped = true;
        if($scope.pendingCard !== null){
          if($scope.pendingCard.title === card.title){
            $scope.matchedPairs++;
            $scope.pendingCard = null;
          }
          else{
            $scope.canFlip = false;
            $timeout(function() {
              card.isFlipped = false;
              $scope.pendingCard.isFlipped = false;
              $scope.pendingCard = null;
              $scope.canFlip = true;
            }, 1000);
          }
        }
        else{
          $scope.pendingCard = card;
        }
      }
    }
  }

  var getCards = function(numPairs){
    $http({
      url: "api/cards",
      method: "GET",
      params: { num: numPairs }
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

    });

    if(!appState.getIsUserSetup()){
      $state.go("menu");
    }
    else{
      getCards(appState.getDifficulty().pairs);
    }
});
