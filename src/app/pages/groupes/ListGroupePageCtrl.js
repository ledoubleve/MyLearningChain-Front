(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupe')
        .controller('ListGroupeCtrl', ListGroupeCtrl);


    function ListGroupeCtrl($scope, $q, $log, $state, groupService, authorizationService) {
        // Service
        var vm = this;
        vm.isReady = false;
        vm.groups = [];
        var groupServiceInstance = null;
        var authorizationServiceInstance = null;
        ensureGroupService()
            .then(ensureAuthorizationService())
            .then(function () {
                groupServiceInstance.getGroups().then(function (groupsReceived) {
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
                    if (groupServiceInstance)
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

        function listGroups() {
            return groupServiceInstance.listStudentProjects();
        }

        function viewProject(projectId) {
            $state.go('Projets.viewprojet', { project: { id: projectId } });
        }

        function mapRoles(roles) {
            vm.canlistgroups = (roles.indexOf("canlistgroups") != -1);
            if (vm.canlistgroups) { vm.listGroups = listGroups; }
        }
    }
})();
