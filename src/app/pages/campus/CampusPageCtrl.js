(function () {
    'use strict';

    angular.module('BlurAdmin.pages.campus')
        .controller('CampusPageCtrl', CampusPageCtrl);


    function CampusPageCtrl($scope, campusService, $q, authorizationService, appSettings, toastr) {
        var vm = this;
        // Propriétés de création d'une classe

        vm.campusProperties = null;
        
        var authorizationServiceInstance = null;
        var campusServiceInstance = null;

        ensureAuthorizationService()
            .then(ensureCampusService())
            .then(function () {
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); });
            }, function (error) { console.log(error) });

        function createCampus() {
            campusServiceInstance.createCampus(vm.campusProperties).then(function (success) {
                vm.campusProperties = null;
                    toastr.info("Création effectuée avec succès, seed : " + success.data.seed, { timeOut: 0, extendedTimeOut: 0, tapToDismiss: false, onclick: false, closeOnHover: false, });

                },
                function (error) {
                    console.log(error);
                    if (error.errors) {
                        toastr.error("Erreurs lors de la création : " + error.errors);
                    } else {
                        toastr.error("Erreur lors de la création : " + error.error);
                    }
                });

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

        function mapRoles(roles) {
            vm.cancreatecampus = (roles.indexOf("cancreatecampus") != -1);
            if (vm.cancreatecampus) { vm.createCampus = createCampus; }
        }
    }

})();
