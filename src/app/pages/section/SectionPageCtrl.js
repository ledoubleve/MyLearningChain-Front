(function () {
    'use strict';

    angular.module('BlurAdmin.pages.section')
        .controller('SectionPageCtrl', SectionPageCtrl);


    function SectionPageCtrl($scope, sectionService, campusService, $q, authorizationService, appSettings, toastr) {
        var vm = this;
        // Propriétés de création d'une classe

        vm.sectionProperties = null;
        
        var authorizationServiceInstance = null;
        var campusServiceInstance = null;
        var sectionServiceInstance = null;

        ensureAuthorizationService()
            .then(ensureSectionService())
            .then(ensureCampusService())
            .then(function () {
                campusServiceInstance.getCampuses().then(function (campusesReceived) {
                    vm.campuses = campusesReceived.data.campus;
                });
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); });
            }, function (error) { console.log(error) });

        function createSection() {
            sectionServiceInstance.createSection(vm.sectionProperties).then(function (success) {
                vm.sectionProperties = null;
                    toastr.info("Création effectuée avec succès");
                },
                function (error) {
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

        function ensureSectionService() {
            var deferredSectionService = $q.defer();

            // Obtient le service de gestion des classes
            if (!sectionServiceInstance) {
                sectionService.get().then(function (sectionService) {
                    sectionServiceInstance = sectionService;
                    if (sectionServiceInstance)
                        deferredSectionService.resolve(sectionServiceInstance);
                    else {
                        deferredSectionService.reject();
                    }
                });
            } else {
                deferredSectionService.resolve(sectionServiceInstance);
            }
            return deferredSectionService.promise;
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
            vm.cancreatesection = (roles.indexOf("cancreatesection") != -1);
            if (vm.cancreatesection) { vm.createSection = createSection; }
        }
    }

})();
