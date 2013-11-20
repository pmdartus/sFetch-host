'use strict';

/* Controllers */

angular.module('SalesFetchApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {
  }).controller('ContactCtrl', function($scope, $http, $filter, $routeParams, $location, Base64) {

      // Retrieve the timeline elments
      $scope.getTimeline = function() {
        
        $scope.contact = $routeParams.name;
        $scope.Date = Date;
        
        $scope.loading = true;
        //var queryUrl = 'http://api.anyfetch.com/documents?search='+$scope.contact+'&limit=50';
        // DEBUG
        var queryUrl = "/offline_smith.json";
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('salesfetch@gmail.com' + ':' + 'Dreamforce2013');
        $http({method: 'GET', url: queryUrl})
          .success(function(data, status, headers, config) {
            //Init new arrays
            $scope.itemsThisWeek = new Array();
            $scope.itemsLastWeek = new Array();

            //Get date limit
            var now = new Date();
            $scope.lastWeek = new Date();
            $scope.lastWeek.setDate(now.getDate()-now.getDay());

            for (var i = 0; i < data.datas.length; i++) {
                var actItem = data.datas[i];
                actItem.date = new Date(actItem.creation_date);

                // This week
                if (actItem.date >= $scope.lastWeek) {
                    $scope.itemThisWeek.push(actItem);
                }
                // After this week
                else {
                    $scope.itemsLastWeek.push(actItem);
                }
            }
          
            console.log(data.datas);
            $scope.items = data.datas;
            $scope.loading = false;
          })
          .error(function(data) {
              console.log('Error', data);
          });
      };

      $scope.displayDocument = function(docId) {
        console.log('/documents/' + docId);
        $location.path('/documents/' + docId);
      };

      // Init the view
      $scope.contact = $routeParams.name;
      $scope.Date = Date;
      $scope.loading = true;
      $scope.getTimeline();

    }).controller('DocumentCtrl', function($scope, $http, $filter, $routeParams, $location, Base64) {
      // Retrieve the document
      $scope.getDocument = function() {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('salesfetch@gmail.com' + ':' + 'Dreamforce2013');
        $http({method: 'GET', url: 'http://api.anyfetch.com/documents/'+$scope.document})
          .success(function(data, status, headers, config) {
            console.log(data);
            $scope.document = data;
          })
          .error(function(data) {
              console.log('Error', data);
          });
      };

      $scope.document = $routeParams.docId;
      $scope.loading = true;
      $scope.getDocument();
    });
