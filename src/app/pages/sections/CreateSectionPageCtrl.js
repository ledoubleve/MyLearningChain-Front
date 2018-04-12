(function () {
    'use strict';

    angular.module('BlurAdmin.pages.sections')
        .controller('CreateSectionPageCtrl', CreateSectionPageCtrl);


    function CreateSectionPageCtrl($scope, sectionService, $q, authorizationService) {
        var vm = this;
        // Propriétés de création d'une classe
        vm.sectionProperties = null;
        var sectionServiceInstance = null;
        var authorizationServiceInstance = null;
        ensureUserService().then(ensureAuthorizationService().then(function (response) {
            authorizationServiceInstance.get().then(function (roles) {


                vm.canCreateUser = (roles.indexOf("canCreateUser") != -1);
                if (vm.canCreateUser) { vm.createStudent = createStudent; }
            });

        }, function (error) { }));
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
        function createStudent() {
            userServiceInstance.createStudent(vm.userProperties).then(function (success) {

            },
                function (error) {

                });
        }
    }

})();
