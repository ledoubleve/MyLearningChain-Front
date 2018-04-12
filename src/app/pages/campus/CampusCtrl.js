(function () {
    'use strict';

    angular.module('BlurAdmin.pages.facilitators')
        .controller('CampusCtrl', CampusCtrl);


    function CampusCtrl($scope, $q, $stateParams, campusService, $log, $state, $uibModal, toastr, authorizationService, jwtHelper, projectService) {
        $scope.isReady = false;
        var campusServiceInstance = null;
        var projectServiceInstance = null;
        var authorizationServiceInstance = null;

        var campus = $stateParams.campus;
        console.log(campus);
        $scope.campus = null;

        ensureCampusService()
            .then(ensureProjectService())
            .then(ensureAuthorizationService())
            .then(function () {
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); }).then(function () {
                    console.log("ta mere");
                    if ($scope.canviewcampus) {
                        console.log("trou de balle");
                        console.log($scope.isReady);
                        if (!campus || campus.id == null || campus.id == undefined || campus.id == "") {
                            $state.go('dashboard');
                        }

                        campusServiceInstance.getCampus(campus.id).then(function (campus) {
                                
                            $scope.campus = campus;
                            var decodeToken = jwtHelper.decodeToken(sessionStorage.getItem('bearer'));
                            $scope.isReady = true;
                            $scope.$apply();
                            console.log(campus);
                        });
                    }
                });
            }, function (error) { console.log(error) });

        function mapRoles(roles) {
            $scope.canviewcampus = (roles.indexOf("canviewcampus") != -1);
        }

        function ensureCampusService() {
            var deferredCampusService = $q.defer();

            // Obtient le service de gestion des intervenants.
            if (!campusServiceInstance) {
                campusService.get().then(function (campusService) {
                    campusServiceInstance = campusService;
                    if (campusServiceInstance)
                        deferredCampusService.resolve(campusServiceInstance);
                    else {
                        deferredCampusService.reject();
                    }
                });
            } else {
                deferredCampusService.resolve(campusServiceInstance);
            }

            return deferredCampusService.promise;

        }

        function ensureProjectService() {
            var deferredProjectService = $q.defer();

            if (!projectServiceInstance) {
                projectService.get().then(function (projectService) {
                    projectServiceInstance = projectService;
                    if (projectServiceInstance)
                        deferredProjectService.resolve(projectServiceInstance);
                    else {
                        deferredProjectService.reject();
                    }
                });
            } else {
                deferredProjectService.resolve(projectServiceInstance);
            }

            return deferredProjectService.promise;
        }

        function ensureAuthorizationService() {
            var deferredAuthorizationService = $q.defer();

            // Obtient le service de gestion des autorisations
            if (!authorizationServiceInstance) {
                authorizationService.get().then(function (authorizationService) {
                    authorizationServiceInstance = authorizationService;
                    if (authorizationServiceInstance)
                        deferredAuthorizationService.resolve(authorizationServiceInstance);
                    else {
                        deferredAuthorizationService.reject();
                    }
                });
            } else {
                deferredAuthorizationService.resolve(authorizationServiceInstance);
            }
            return deferredAuthorizationService.promise;
        }
    }
})();
