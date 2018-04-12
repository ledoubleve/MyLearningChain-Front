(function () {
    'use strict';

    angular.module('BlurAdmin.pages.project')
        .controller('ProjectListCtrl', ProjectListCtrl);


    function ProjectListCtrl($scope, $q, $log, $state, projectService, authorizationService) {
        // Service
        var vm = this;
        vm.isReady = false;
        vm.projects = [];
        var projectServiceInstance = null;
        var authorizationServiceInstance = null;
        ensureProjectService()
            .then(ensureAuthorizationService())
            .then(function () {
                projectServiceInstance.getProjects().then(function (projectsReceived) {
                    vm.projects = projectsReceived.data.projects;
                    vm.isReady = true;
                });
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles) });
            }, function (error) { console.log(error) });

        function ensureProjectService() {
            var deferredProjectService = $q.defer();

            // Obtient le service de gestion des utilisateurs.
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

        function listProjects() {
            return projectServiceInstance.listStudentProjects();
        }

        function viewProject(projectId) {
            $state.go('Projets.viewprojet', { project: { id: projectId } })            
        }

        function mapRoles(roles) {
            vm.canviewproject = (roles.indexOf("canviewproject") != -1);
            if (vm.canviewproject) { vm.viewProject = viewProject; }
        }
    }
})();
