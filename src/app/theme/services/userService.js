/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('userService', userService);

    userService.$inject = ['$q', 'authorizationService','appSettings'];
    /** @ngInject */
    function userService($q, authorizationService, appSettings) {

        var getUserService = function getUserService() {
            var deferredGet = $q.defer();
            var authorizations = authorizationService.get();

            if (authorizations) {
                var userService = {};
                userService.createStudent = createStudent;
                userService.createFacilitator = createFacilitator;
                userService.getStudents = getStudents;
                deferredGet.resolve(userService);
            } else {
                var getApiAuthorizationTask = $q.defer();
                getApiAuthorizationTask.reject(reason);
                return getApiAuthorizationTask.promise;
            }
            return deferredGet.promise;
        }

        function createStudent(userProperties) {
            var createUserApiUrl = appSettings.apiBaseAdminUrl + '/students/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer") ,'Access-Control-Allow-Origin' : '*'}
            };
            return axios.post(createUserApiUrl, userProperties, config)
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

        function getStudents() {
            var getGroupsApiUrl = appSettings.apiBaseAdminUrl + '/students/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getGroupsApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                return response.data.students;
            }

            function queryFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }
        function createFacilitator(userProperties) {
            var createUserApiUrl = appSettings.apiBaseAdminUrl + '/facilitators/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.post(createUserApiUrl, userProperties, config)
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

        

        return {
            get: getUserService
        };
    }
})();