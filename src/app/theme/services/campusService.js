(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('campusService', campusService);

    campusService.$inject = ['$q', 'appSettings'];
    /** @ngInject */
    function campusService($q, appSettings) {

        var getCampusService = function getCampusService() {
            var deferredGet = $q.defer();
            var campusService = {};
            campusService.getCampuses = getCampuses;
            campusService.getCampus = getCampus;
            campusService.createCampus = createCampus;
            deferredGet.resolve(campusService);
            return deferredGet.promise;
        }

        function getCampuses() {
            var getCampusesApiUrl = appSettings.apiBaseAdminUrl + '/campus/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getCampusesApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                return response;
            }

            function queryFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }

        }

        function getCampus(id) {
            var getCampusesApiUrl = appSettings.apiBaseAdminUrl + '/campus/' + id;
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getCampusesApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                return response.data;
            }

            function queryFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }

        }

        function createCampus(campusProperties) {
            var createCampusApiUrl = appSettings.apiBaseAdminUrl + '/campus/';
            var config = {
                headers: { 'Authorization': "bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            console.log(campusProperties);
            return axios.post(createCampusApiUrl, campusProperties, config)
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
            get: getCampusService
        };
    }
})();