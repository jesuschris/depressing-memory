
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

var theme;

/* App */

var app = angular.module('DepressingMemory', ['ngMaterial','ngMessages'])
  .config(function($mdThemingProvider) {
    var customPrimary = {
         '50': '#dcdbe7',
         '100': '#cdccdc',
         '200': '#bebdd2',
         '300': '#afadc8',
         '400': '#a09ebd',
         '500': '918FB3',
         '600': '#8280a9',
         '700': '#73719e',
         '800': '#666392',
         '900': '#5b5983',
         'A100': '#ebeaf1',
         'A200': '#f9f9fb',
         'A400': '#ffffff',
         'A700': '#514f74'
     };
     $mdThemingProvider
         .definePalette('customPrimary',
                         customPrimary);

     var customAccent = {
         '50': '#201d28',
         '100': '#2c2737',
         '200': '#383246',
         '300': '#443c55',
         '400': '#504764',
         '500': '#5c5173',
         '600': '#746791',
         '700': '#81749d',
         '800': '#8f83a7',
         '900': '#9c92b2',
         'A100': '#746791',
         'A200': '685C82',
         'A400': '#5c5173',
         'A700': '#aaa1bc'
     };
     $mdThemingProvider
         .definePalette('customAccent',
                         customAccent);

     var customWarn = {
         '50': '#d0b5d3',
         '100': '#c6a5ca',
         '200': '#bc95c0',
         '300': '#b185b7',
         '400': '#a775ad',
         '500': '9D65A4',
         '600': '#905997',
         '700': '#804f87',
         '800': '#714676',
         '900': '#623d66',
         'A100': '#dac5dd',
         'A200': '#e4d5e6',
         'A400': '#efe5f0',
         'A700': '#523356'
     };
     $mdThemingProvider
         .definePalette('customWarn',
                         customWarn);

     var customBackground = {
         '50': '#ffffff',
         '100': '#ffffff',
         '200': '#ffffff',
         '300': '#ffffff',
         '400': '#f9fbfb',
         '500': 'E9F1F2',
         '600': '#d9e7e9',
         '700': '#c9dddf',
         '800': '#b9d2d6',
         '900': '#a9c8cc',
         'A100': '#ffffff',
         'A200': '#ffffff',
         'A400': '#ffffff',
         'A700': '#99bec3'
     };
     $mdThemingProvider
         .definePalette('customBackground',
                         customBackground);

   $mdThemingProvider.theme('default')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       .backgroundPalette('customBackground')

    theme = $mdThemingProvider._THEMES;
  })
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
      var difficulty = difficultyLevels[1];

      var depressingnessLevels = [
        {
          "id" : 0,
          "title" : "Sad"
        },
        {
          "id" : 1,
          "title" : "Reality Sad"
        }
      ];
      var depressingness = depressingnessLevels[0];

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
        },
        getDepressingness: function() {
            return depressingness;
        },
        getDepressingnessLevels: function() {
            return depressingnessLevels;
        },
        setDepressingness: function (value) {
          depressingness = value;
          updateObservers("depressingness");
        }
      };
  });

/* Controllers */

app.controller("AppController", function($scope, appState){

  $scope.pages = "";

});

app.controller("SetupMenuController", function($scope, $interval, $timeout, appState) {

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

  $scope.depressingnessLevels = appState.getDepressingnessLevels();
  $scope.depressingness = appState.getDepressingness();

  $scope.name = "";

  $scope.startGame = function(type){
    if(type === "solo" || type === "paired"){

    }
  }

});

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
    getCards(appState.getDifficulty().pairs);
    appState.observe(function(message){
      if(message === "difficulty"){
        //getCards(appState.getDifficulty().pairs);
      }
    });

});
/* Directives */

/* Filters */
