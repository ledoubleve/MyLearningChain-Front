(function () {
    'use strict';

    angular.module('BlurAdmin.pages.project')
        .controller('ProjectCtrl', ProjectCtrl);


    function ProjectCtrl($scope, $q, $stateParams, projectService, $log, $state, $uibModal, toastr, authorizationService, offerService, jwtHelper) {
        var vm = this;
        $scope.isReady = false;
        var projectServiceInstance = null;
        var authorizationServiceInstance = null;

        var project = $stateParams.project;

        $scope.project = {};

        ensureProjectService()
            .then(ensureAuthorizationService())
            .then(function () {
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); }).then(function () {
                    if ($scope.canviewproject) {
                        projectServiceInstance.getProject(project.id).then(function (project) {
                            $scope.isReady = true;
                            $scope.project = project;
                            if (!$scope.$$phase) {

                                $scope.$apply();
                            }
                        });
                    }
                });
            }, function (error) { console.log(error) });

        function mapRoles(roles) {
            $scope.canviewproject = (roles.indexOf("canviewproject") != -1);
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
