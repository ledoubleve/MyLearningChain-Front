(function () {
    'use strict';
    angular.module('BlurAdmin.pages.facilitators')
        .controller('FacilitatorListCtrl', FacilitatorListCtrl);

    function FacilitatorListCtrl($scope, $q, facilitatorService, authorizationService, $log, $state) {
        var vm = this;

        vm.isReady = false;
        var facilitatorServiceInstance = null;
        var authorizationServiceInstance = null;

        ensureFacilitatorService()
            .then(ensureAuthorizationService())
            .then(function () {
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); });
            }, function (error) { console.log(error) });

        function mapRoles(roles) {
            vm.canlistfacilitator = (roles.indexOf("canlistfacilitator") != -1);
            if (vm.canlistfacilitator) {
                facilitatorServiceInstance.getFacilitators().then(function (facilitators) {
                    vm.facilitators = correctImages(facilitators.data.facilitators);
                    vm.isReady = true;
                    if (!$scope.$$phase) {

                        $scope.$apply();
                    }
                });
            }
        }

        function correctImages(facilitators) {
            facilitators.forEach(function (element) {
                if (!element.img_uri == null || element.img_uri == "") {
                    element.img_uri = "/assets/img/app/profile/Nick.png";
                }
            });
            return facilitators;
        }
        function ensureFacilitatorService() {
            var deferredFacilitatorService = $q.defer();

            // Obtient le service de gestion des intervenants.
            if (!facilitatorServiceInstance) {
                facilitatorService.get().then(function (userService) {
                    facilitatorServiceInstance = userService;
                    if (facilitatorServiceInstance)
                        deferredFacilitatorService.resolve(facilitatorServiceInstance);
                    else {
                        deferredFacilitatorService.reject();
                    }
                });
            } else {
                deferredFacilitatorService.resolve(facilitatorServiceInstance);
            }

            return deferredFacilitatorService.promise;

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

        vm.viewIntervenant = function (id) {
            $state.go('Facilitators.viewfacilitator', { facilitator: { 'id': id } });
        }

    }
})();