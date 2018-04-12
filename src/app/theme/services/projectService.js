(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('projectService', projectService);

    projectService.$inject = ['$q', 'authorizationService','appSettings', 'jwtHelper'];
    /** @ngInject */
    function projectService($q, authorizationService, appSettings, jwtHelper) {

        var getProjectService = function getProjectService() {
            var deferredGet = $q.defer();
            var authorizations = authorizationService.get();

            if (authorizations) {
                var projectService = {};
                projectService.createProject = createProject;
                //projectService.listMyProjects = listMyProjects;
                projectService.listCampusProjects = listCampusProjects;
                projectService.getProjects = getProjects;
                projectService.getProjectsAdmin = getProjectsAdmin;
                projectService.getProject = getProject;
                projectService.getProjectAdmin = getProjectAdmin; 
                deferredGet.resolve(projectService);
            } else {
                var getApiAuthorizationTask = $q.defer();
                getApiAuthorizationTask.reject(reason);
                return getApiAuthorizationTask.promise;
            }
            return deferredGet.promise;
        }

        function createProject(projectProperties) {
            var createProjectApiUrl = appSettings.apiBaseAdminUrl + '/projects/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.post(createProjectApiUrl, projectProperties, config)
                .then(creationComplete, creationFailed);

            function creationComplete(response) {
                return response;
            }

            function creationFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        function listCampusProjects(campusId) {
            var getDetailsCampusApiUrl = appSettings.apiBaseAdminUrl + '/campus/' + campusId;
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };

            return axios.get(getDetailsCampusApiUrl, config)
                .then(getComplete, getFailed);

            function getComplete(response) {
                return $q.resolve(response.data.projects);
            }

            function getFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        function getProjects() {
            var bearer = window.sessionStorage.getItem("bearer");
            var config = {
                headers: { 'Authorization': "Bearer " + bearer, 'Access-Control-Allow-Origin': '*' }
            };
            var getProjectsApiUrl = appSettings.apiBasePubUrl + '/projects/';

            return axios.get(getProjectsApiUrl, config)
                .then(creationComplete, creationFailed);

            function creationComplete(response) {
                return response;
            }

            function creationFailed(reason) {

                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }
        function getProjectsAdmin() {
            var bearer = window.sessionStorage.getItem("bearer");
            var config = {
                headers: { 'Authorization': "Bearer " + bearer, 'Access-Control-Allow-Origin': '*' }
            };
            var getProjectsApiUrl = appSettings.apiBaseAdminUrl + '/projects/';

            return axios.get(getProjectsApiUrl, config)
                .then(creationComplete, creationFailed);

            function creationComplete(response) {
                return response;
            }

            function creationFailed(reason) {

                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }
        function getProjectAdmin(id) {
            var bearer = window.sessionStorage.getItem("bearer");
            var config = {
                headers: { 'Authorization': "Bearer " + bearer, 'Access-Control-Allow-Origin': '*' }
            };
            var getProjectsApiUrl = appSettings.apiBaseAdminUrl + '/projects/' + id;

            return axios.get(getProjectsApiUrl, config)
                .then(creationComplete, creationFailed);

            function creationComplete(response) {
                return response.data;
            }

            function creationFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        function getProject(id) {
            var bearer = window.sessionStorage.getItem("bearer");
            var config = {
                headers: { 'Authorization': "Bearer " + bearer, 'Access-Control-Allow-Origin': '*' }
            };
            var user = jwtHelper.decodeToken(bearer).user;
            var getProjectsApiUrl;
            if (user.type === 'facilitator') {
                getProjectsApiUrl = appSettings.apiBaseAdminUrl + '/projects/' + id;
            } else {
                getProjectsApiUrl = appSettings.apiBasePubUrl + '/projects/' + id;
            }
            

            return axios.get(getProjectsApiUrl, config)
                .then(creationComplete, creationFailed);

            function creationComplete(response) {
                console.log(response.data);
                return response.data;
            }

            function creationFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        return {
            get: getProjectService
        };
    }
})();