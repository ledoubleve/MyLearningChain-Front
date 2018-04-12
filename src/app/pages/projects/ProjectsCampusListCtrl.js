(function () {
    'use strict';

    angular.module('BlurAdmin.pages.facilitators')
        .controller('ProjectsCampusListCtrl', ProjectsCampusListCtrl);


    function ProjectsCampusListCtrl($scope, $q, facilitatorService, $log, $state) {
        var vm = this;

        vm.isReady = false;
        ensureProjectService().then(
            ensureAuthorizationService().then(function () {
                authorizationServiceInstance.get().then(function (roles) {
                    vm.canlistmyprojects = (roles.indexOf("canlistmyprojects") != -1);
                    if (vm.canlistmyprojects) { vm.projectsList = listProjects; }
                });
            }, function (error) { console.log(error) }));

        function ensureProjectService() {
            var deferredProjectService = $q.defer();

            // Obtient le service de gestion des projets.
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

        function listMyProjects() {
            projectServiceInstance.listMyProjects(vm.projectProperties).then(function (success) {

            },
                function (error) {
                    console.log(error);
                });
        }

        function viewProject(projectId) {
            $state.go('Projets.viewprojet', { project: { 'id': projectId } })
        }
        
    }

})();
