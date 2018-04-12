/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.project')
        .controller('ProjectPageCtrl', ProjectPageCtrl);


    function ProjectPageCtrl($scope, projectService, $q, authorizationService, appSettings, $state, campusService, toastr) {
        var vm = this;
        vm.isReady = false;
        // Propriétés de création d'un utilisateur

        vm.projectProperties = null;
        vm.valeur = 5;

        var userServiceInstance = null;
        var authorizationServiceInstance = null;
        var campusServiceInstance = null;

        var projectServiceInstance = null;
        var authorizationServiceInstance = null;
        ensureProjectService()
            .then(ensureAuthorizationService())
            .then(ensureCampusService())
            .then(function () {
                campusServiceInstance.getCampuses().then(function (campusesReceived) {
                    vm.campuses = campusesReceived.data.campus;
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

        function createProject() {
            projectServiceInstance.createProject(vm.projectProperties).then(function (success) {
                toastr.success('Le projet a bien été créé !');
                vm.projectProperties = null;
            },
                function (error) {
                    console.log(error);
                });
        }

        function viewProject(id) {
            $state.go('Projets.viewprojet', { project: { 'id': id } });
        }

        function mapRoles(roles) {
            vm.cancreateproject = (roles.indexOf("cancreateproject") != -1);
            vm.canlistmyprojects = (roles.indexOf("canlistmyprojects") != -1);
            vm.canlistcampusprojects = (roles.indexOf("canlistcampusprojects") != -1);
            vm.canviewproject = (roles.indexOf("canviewproject") != -1);
            if (vm.cancreateproject) { vm.createProject = createProject; }
            if (vm.canlistcampusprojects) {
                projectServiceInstance.listCampusProjects("5acd00a583bc52000138e82a").then(function (success) {
                    vm.projectsCampus = success;
                });
            }
            if (vm.canviewproject) { vm.viewProject = viewProject }

        }
    }

})();
