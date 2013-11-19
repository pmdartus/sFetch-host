'use strict';

/* Controllers */

angular.module('SalesFetchApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

  }).controller('UsersCtrl', function($scope, $http, $filter, Base64) {
        
        console.log('Loading');
        $scope.Date = Date;
        $scope.loading = false;
        
        $scope.getTimeline = function() {
            $scope.loading = true;
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('salesfetch@gmail.com' + ':' + 'Dreamforce2013');
        $http({method: 'GET', url: 'http://api.anyfetch.com/documents?search='+$scope.contact+'&limit=50'})
            .success(function(data, status, headers, config) {
                for (var i = 0; i < data.datas.length; i++) {
                    var actItem = data.datas[i];
                    actItem.date = new Date(actItem.creation_date);
                    
                    if (actItem.semantic_document_type == "5252ce4ce4cfcd16f55cfa3a") {
                        console.log("Getting rid of contact");
                        data.datas.splice(i, 1);
                        i--;
                    }
                }
                
                console.log(data.datas);
                $scope.items = data.datas;
                $scope.loading = false;
                // this callback will be called asynchronously
                // when the response is available
            })
            .error(function(data, status, headers, config) {
                console.log("Error", data);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
    });
