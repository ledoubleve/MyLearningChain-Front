(function () {
    'use strict';
    angular.module('BlurAdmin.pages.campus')
        .controller('CampusListCtrl', CampusListCtrl);

    function CampusListCtrl($scope, $q, campusService, authorizationService, $log, $state) {
        var vm = this;

        vm.isReady = false;
        var campusServiceInstance = null;
        var authorizationServiceInstance = null;

        ensureCampusService()
            .then(ensureAuthorizationService())
            .then(function () {
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); });
            }, function (error) { console.log(error) });

        function mapRoles(roles) {
            vm.canlistcampus = (roles.indexOf("canlistcampus") != -1);
            if (vm.canlistcampus) {
                campusServiceInstance.getCampuses().then(function (campusesReceived) {
                    vm.campuses = correctImages(campusesReceived.data.campus);
                    vm.isReady = true;
                    $scope.$apply();
                });
            }
        }

        function correctImages(campuses) {
            campuses.forEach(function (element) {
                campusServiceInstance.getCampus(element.id).then(function (data) {
                    element.projectsCount = data.projects.length;
                })
            });
            console.log(campuses);
            return campuses;
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

        function ensureCampusService() {
            var deferredCampusService = $q.defer();

            // Obtient le service de gestion des campus
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

        vm.viewCampus = function (id) {
            $state.go('Campus.viewcampus', { campus: { 'id': id } });
        }

    }
})();