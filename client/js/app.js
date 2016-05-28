
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
var app = angular.module('DepressingMemory',
  ['ngMaterial','ngMessages','ui.router'])
  .config(function($mdThemingProvider) {

    var customPrimary = {'50': '#dcdbe7','100': '#cdccdc','200': '#bebdd2','300': '#afadc8','400': '#a09ebd','500': '918FB3','600': '#8280a9','700': '#73719e','800': '#666392','900': '#5b5983','A100': '#ebeaf1','A200': '#f9f9fb','A400': '#ffffff','A700': '#514f74'};
    $mdThemingProvider.definePalette('customPrimary',customPrimary);

    var customAccent = {'50': '#201d28','100': '#2c2737','200': '#383246','300': '#443c55','400': '#504764','500': '#5c5173','600': '#746791','700': '#81749d','800': '#8f83a7','900': '#9c92b2','A100': '#746791','A200': '685C82','A400': '#5c5173','A700': '#aaa1bc'};
    $mdThemingProvider.definePalette('customAccent',customAccent);

    var customWarn = {'50': '#d0b5d3','100': '#c6a5ca','200': '#bc95c0','300': '#b185b7','400': '#a775ad','500': '9D65A4','600': '#905997','700': '#804f87','800': '#714676','900': '#623d66','A100': '#dac5dd','A200': '#e4d5e6','A400': '#efe5f0','A700': '#523356'};
    $mdThemingProvider.definePalette('customWarn',customWarn);

    $mdThemingProvider.theme('default')
     .primaryPalette('customPrimary')
     .accentPalette('customAccent')
     .warnPalette('customWarn')

    theme = $mdThemingProvider._THEMES;
  })
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
      .state('menu', {
        url: '/',
        views: {
          '': { templateUrl: './templates/app-page.html'},
          'content@menu': { templateUrl: './templates/menu-page.html'}
         }
      })
      .state('game', {
        url: '/game',
        views: {
          '': { templateUrl: './templates/app-page.html'},
          'content@game': { templateUrl: './templates/game-page.html'}
         }
      });
    }
  ])
  .factory('appState', function () {

      //Observer pattern
      var _observers = [];

      var updateObservers = function(message){
        angular.forEach(_observers, function (callBack) {
            callBack(message);
        });
      }

      // State vars

      var isUserSetup = false;

      //Values

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

      return {
        observe: function (callBack) {
          _observers.push(callBack);
        },
        getIsUserSetup: function() {
            return isUserSetup;
        },
        setIsUserSetup: function (value) {
          isUserSetup = value;
          updateObservers("isUserSetup");
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
