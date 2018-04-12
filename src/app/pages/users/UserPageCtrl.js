(function () {
    'use strict';

    angular.module('BlurAdmin.pages.user')
        .controller('UserPageCtrl', UserPageCtrl);


    function UserPageCtrl($scope, userService, $q, authorizationService, appSettings, campusService, sectionService, toastr) {
        var vm = this;
        // Propriétés de création d'un utilisateur
        vm.studentProperties = {};
        vm.studentProperties.scopes = [{}];

        vm.facilitatorProperties = {};
        vm.facilitatorProperties.scopes = [{}];
        vm.facilitatorProperties.tags = [{}];

        var userServiceInstance = null;
        var authorizationServiceInstance = null;
        var campusServiceInstance = null;
        var sectionServiceInstance = null;


        vm.addScopeFac = function () {
            vm.facilitatorProperties.scopes.push({});
        }
        vm.addTagFac = function () {
            vm.facilitatorProperties.tags.push({});
        }
        vm.addScopeStu = function () {
            vm.studentProperties.scopes.push({});
        }

        ensureUserService()
            .then(ensureAuthorizationService())
            .then(ensureCampusService())
            .then(ensureSectionService())
            .then(function () {
                campusServiceInstance.getCampuses().then(function (campusesReceived) {
                    vm.campuses = campusesReceived.data.campus;
                });
                sectionServiceInstance.listSections().then(function (sectionReceived) {
                    vm.sections = sectionReceived.data.sections;
                });
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); });
            }, function (error) { console.log(error) });

        function ensureUserService() {
            var deferredUserService = $q.defer();

            // Obtient le service de gestion des utilisateurs.
            if (!userServiceInstance) {
                userService.get().then(function (userService) {
                    userServiceInstance = userService;
                    if (userServiceInstance)
                        deferredUserService.resolve(userServiceInstance);
                    else {
                        deferredUserService.reject();
                    }
                });
            } else {
                deferredUserService.resolve(userServiceInstance);
            }

            return deferredUserService.promise;

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
                deferredSectionService.resolve(campusServiceInstance);
            }
            return deferredSectionService.promise;
        }

        function createStudent() {
            var userProperties = angular.copy(vm.studentProperties);
            userServiceInstance.createStudent(mapScopes(userProperties)).then(function (success) {
                toastr.info("Création effectuée avec succès");
            },
                function (error) {
                    if (error.response.data.errors) {
                        toastr.error("Erreurs lors de la création : " + JSON.stringify(error.response.data.errors));
                    } else {
                        toastr.error("Erreur lors de la création : " + JSON.stringify(error.response.data.error));
                    }
                });
            vm.studentProperties.scopes = [{}];


        }
        function createFacilitator() {
            var userProperties = angular.copy(vm.facilitatorProperties);
            userServiceInstance.createFacilitator(mapTags(mapScopes(userProperties))).then(function (success) {
                    toastr.info("Création effectuée avec succès, seed : " + success.data.seed, {timeOut: 0,extendedTimeOut: 0,tapToDismiss: false,onclick: false,closeOnHover: false,});
            },
                function (error) {
                    if (error.response.data.errors) {
                        toastr.error("Erreurs lors de la création : " + JSON.stringify(error.response.data.errors));
                    } else {
                        toastr.error("Erreur lors de la création : " + JSON.stringify(error.response.data.error));
                    }
                });

            vm.facilitatorProperties.scopes = [{}];
            vm.facilitatorProperties.tags = [{}];
        }

        function mapScopes(initialProps) {
            var scopes = [];
            initialProps.scopes.forEach(function (element) {
                if (element.value)
                    scopes.push(element.value);
            });
            initialProps.scopes = scopes;
            return initialProps;
        }

        function mapTags(initialProps) {
            var tags = [];
            initialProps.tags.forEach(function (element) {
                if (element.value)
                    tags.push(element.value);
            });
            initialProps.tags = tags;
            return initialProps;
        }

        function mapRoles(roles) {
            vm.cancreatestudent = (roles.indexOf("cancreatestudent") != -1);
            vm.cancreatefacilitator = (roles.indexOf("cancreatefacilitator") != -1);
            if (vm.cancreatestudent) { vm.createStudent = createStudent; }
            if (vm.cancreatefacilitator) { vm.createFacilitator = createFacilitator; }
        }
    }
})();