'use strict';

/* Controllers */

angular.module('SalesFetchApp.controllers', [])
    .controller('AppCtrl', function ($scope, $http) {
    })
    //-------------------------------------------------------------------------
    //                          TimelineCtrl
    //-------------------------------------------------------------------------

    .controller('TimelineCtrl', function($scope, $http, $filter, $routeParams, $location) {
      // $scope.toggleFilter = false;
      $scope.filtersType = new Object();
      $scope.Object = Object;
      console.info($scope.Object.keys($scope.filtersType).length);

      // Retrieve the timeline elments
      $scope.getTimeline = function() {
        
        $scope.contact = $routeParams.name;
        $scope.Date = Date;
        
        $scope.loading = true;
        // DEBUG
        //var timelineUrl = "/offline_smith.json";
        var timelineUrl = 'http://api.anyfetch.com/documents?search='+$scope.contact+'&limit=50';


        $http.defaults.headers.common['Authorization'] = 'token ' + $scope.token;
        $http({method: 'GET', url: timelineUrl})
          .success(function(data, status, headers, config) {
            //Init new arrays
            $scope.itemThisWeek = new Array();
            $scope.itemsLastWeek = new Array();

            //Get date limit
            var now = new Date();
            $scope.lastWeek = new Date();
            $scope.lastWeek.setDate(now.getDate()-now.getDay());

            for (var i = 0; i < data.datas.length; i++) {
                var actItem = data.datas[i];

                //Delete contacts
                if (actItem.semantic_document_type == "5252ce4ce4cfcd16f55cfa3a") {
                    // console.log('Getting rid of contact');
                    data.datas.splice(i, 1);
                    i--;
                } else {
                    //Get title and desc
                    actItem.title = $filter('infoItem')(actItem, "title");
                    actItem.snippet = $filter('infoItem')(actItem, "snippet");
                    
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
            }
          
            console.log("timeline : ", data.datas);
            $scope.items = data.datas;
            $scope.loading = false;
          })
          .error(function(data) {
              console.log('Error', data);
          });

        /*var documentTypesUrl = "/root.json";
        //var documentTypesUrl = 'http://api.anyfetch.com/';
        $http({method: 'GET', url: documentTypesUrl})
          .success(function(data, status, headers, config) {
            console.log("documentsTypes : ", data.document_types);
          })
          .error(function(data) {
              console.log('Error', data);
          });*/
      };

      $scope.displayDocument = function(docId) {
        console.log('/documents/' + docId);
        $location.path('/documents/' + docId);
      };

      // Init the view
      $scope.contact = $routeParams.name;
      $scope.sfID = $routeParams.ui;
      $scope.Date = Date;
      $scope.loading = true;

      //Verify user
      $scope.sfID = $routeParams.ui;
      $scope.token = $routeParams.token;
      if ($scope.token) {
        $scope.getTimeline();
      } else {
        $http({method: 'GET', url: 'http://provider-salesforce.herokuapp.com/token?sfid='+$scope.sfID})
          .success(function(data, status, headers, config) {
            if (status == 200) {
              $scope.token = data.toString().slice(1, data.length-1);
              $scope.getTimeline();
            }
          })
          .error(function(data) {
              //C LE BOWDEL
              console.log('Error while logging user', data);
          });
      }

    })


    //-------------------------------------------------------------------------
    //                          UserCtrl
    //-------------------------------------------------------------------------

    .controller('UserCtrl', function($scope, $http, $filter, $routeParams, $location) {
      // Retrieve the user
      $scope.getUser = function() {
        $http.defaults.headers.common['Authorization'] = 'token ' + $scope.token;
        $http({method: 'GET', url: 'http://api.anyfetch.com/'})
          .success(function(data, status, headers, config) {
            console.log(data);
            $scope.providers = data.provider_status;

            for(var i=0; i < $scope.providers.length; i++) {
              var actUpdate = new Date($scope.providers[i].updated);

              if (actUpdate > $scope.lastUpdate) {
                $scope.lastUpdate = actUpdate;
              }
            }

            var now = new Date();
            var deltaNow = Math.floor((now  - $scope.lastUpdate)/60000);
            if (deltaNow > 10) {
              $scope.canUpdate = true;
            }

            $scope.loading = false;
          })
          .error(function(data) {
              console.log('Error', data);
          });
      };

      // Update the db
      $scope.update = function() {
        if ($scope.canUpdate) {
          $scope.canUpdate = false;

          $http.defaults.headers.common['Authorization'] = 'token ' + $scope.token;
          $http({method: 'POST', url: 'http://api.anyfetch.com/update'})
            .success(function(data, status, headers, config) {
              console.log(data, status);
            })
            .error(function(data) {
                console.log('Error', data);
            });
          };
      };

      //Init the view
      $scope.canUpdate = false;
      $scope.lastUpdate = new Date(3600*24*1000); //Jan02_1970
      $scope.loading = true;

      //Verify user
      $scope.sfID = $routeParams.ui;
      $scope.token = $routeParams.token;
      if ($scope.token) {
        $scope.getUser();
      } else {
        $http({method: 'GET', url: 'http://provider-salesforce.herokuapp.com/token?sfid='+$scope.sfID})
          .success(function(data, status, headers, config) {
            if (status == 200) {
              $scope.token = data.toString().slice(1, data.length-1);
              $scope.getUser();
            }
          })
          .error(function(data) {
              //C LE BOWDEL
              console.log('Error while logging user', data);
          });
      }
    })


    //-------------------------------------------------------------------------
    //                          DocumentCtrl
    //-------------------------------------------------------------------------
    
    .controller('DocumentCtrl', function($scope, $http, $filter, $routeParams, $location) {
      // Retrieve the document
      $scope.getDocument = function() {
        $http.defaults.headers.common['Authorization'] = 'token ' + $scope.token;
        $http({method: 'GET', url: 'http://api.anyfetch.com/documents/'+$scope.document})
          .success(function(data, status, headers, config) {
            console.log(data);
            $scope.document = data;
            $scope.docType = data.semantic_document_type || data.binary_document_type;
            $scope.templateUrl = 'partials/doctype-' + $scope.docType;
            $scope.metadatas = data.datas[$scope.docType];
            $scope.loading = false;
          })
          .error(function(data) {
              console.log('Error', data);
          });
      };

      $scope.backTimeline = function()  
      {
        console.log('Back to info');
        $location.path('/timeline').search('ui='+$scope.sfID,'name='+$scope.contact);
      };

      $scope.document = $routeParams.docId;
      $scope.contact = $routeParams.name;
      $scope.loading = true;

      //Verify user
      $scope.sfID = $routeParams.ui;
      $scope.token = $routeParams.token;
      if ($scope.token) {
        $scope.getDocument();
      } else {
        $http({method: 'GET', url: 'http://provider-salesforce.herokuapp.com/token?sfid='+$scope.sfID})
          .success(function(data, status, headers, config) {
            if (status == 200) {
              $scope.token = data.toString().slice(1, data.length-1);
              $scope.getDocument();
            }
          })
          .error(function(data) {
              //C LE BOWDEL
              console.log('Error while logging user', data);
          });
      }
    });
