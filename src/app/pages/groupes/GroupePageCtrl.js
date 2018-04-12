(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupe')
        .controller('GroupePageCtrl', GroupePageCtrl);


    function GroupePageCtrl($scope, groupService, projectService, $q, authorizationService, appSettings, toastr, userService) {
        var vm = this;
        // Propriétés de création d'une classe

        vm.sectionProperties = null;
        
        var authorizationServiceInstance = null;
        var groupServiceInstance = null;
        var projectServiceInstance = null;
        var userServiceInstance = null;

        ensureAuthorizationService()
            .then(ensureGroupService())
            .then(ensureUserService())
            .then(ensureProjectService())
            .then(function () {
                projectServiceInstance.getProjectsAdmin().then(function (projectsReceived) {
                    vm.projects = projectsReceived.data.projects;
                });
                userServiceInstance.getStudents().then(function (studentsReceived) {
                    vm.students = studentsReceived;
                });
                groupServiceInstance.getGroups().then(function (groupsReceived) {
                    vm.groups = groupsReceived;
                });
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); });
            }, function (error) { console.log(error) });

        function createGroup() {
            groupServiceInstance.createGroup(vm.groupProperties).then(function (success) {
                    toastr.info("Création effectuée avec succès, seed : " + success.data.seed, { timeOut: 0, extendedTimeOut: 0, tapToDismiss: false, onclick: false, closeOnHover: false, });
                },
                function (error) {
                    if (error.errors) {
                        toastr.error("Erreurs lors de la création : " + error.errors);
                    } else {
                        toastr.error("Erreur lors de la création : " + error.error);
                    }
                });

        }

        function linkGroup() {
            groupServiceInstance.linkGroupAndUser(vm.populationProperties).then(function (success) {

                    toastr.info("Etudiant affecté au groupe avec succès");
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

        function ensureGroupService() {
            var deferredGroupService = $q.defer();

            // Obtient le service de gestion des groupes
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
        function ensureProjectService() {
            var deferredProjectService = $q.defer();

            // Obtient le service de gestion des projets
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

        function mapRoles(roles) {
            vm.cancreategroup = (roles.indexOf("cancreategroup") != -1);
            if (vm.cancreategroup) { vm.createGroup = createGroup; }

            vm.canlinkgroup = (roles.indexOf("canlinkgroup") != -1);
            if (vm.canlinkgroup) { vm.linkGroup = linkGroup; }
        }
    }

})();
