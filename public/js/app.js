'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/contacts', {
        templateUrl: 'partials/contacts',
        controller: SearchContact
      }).
      when('/contacts/:id', {
        templateUrl: 'partials/timeline',
        controller: TimeLine
      }).
      when('/document/:id', {
        templateUrl: 'partials/fullDocuent',
        controller: DisplayDocument
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);