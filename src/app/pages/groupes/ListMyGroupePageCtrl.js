(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupe')
        .controller('ListMyGroupCtrl', ListMyGroupCtrl);


    function ListMyGroupCtrl($scope, $q, $log, $state, groupService, authorizationService) {
        // Service
        var vm = this;
        vm.isReady = false;
        vm.groups = [];
        var groupServiceInstance = null;
        var authorizationServiceInstance = null;
        ensureGroupService()
            .then(ensureAuthorizationService())
            .then(function () {
                groupServiceInstance.getMyGroups().then(function (groupsReceived) {
                    console.log(groupsReceived);
                    vm.groups = groupsReceived;
                    vm.isReady = true;
                });
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles) });
            }, function (error) { console.log(error) });

        function ensureGroupService() {
            var deferredGroupService = $q.defer();

            // Obtient le service de gestion des groupes.
            if (!groupServiceInstance) {
                groupService.get().then(function (groupService) {
                    groupServiceInstance = groupService;
                    if (projectServiceInstance)
                        deferredGroupService.resolve(groupServiceInstance);
                    else {
                        deferredGroupService.reject();
                    }
                });
            } else {
                deferredGroupService.resolve(groupServiceInstance);
            }

            return deferredGroupService.promise;
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
        

        function mapRoles(roles) {
            vm.canlistmygroups = (roles.indexOf("canlistmygroups") != -1);
            if (vm.canlistmygroups) { vm.listGroups = listGroups; }
        }
    }
})();
