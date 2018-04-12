(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('facilitatorService', facilitatorService);

    facilitatorService.$inject = ['$q', 'appSettings'];
    /** @ngInject */
    function facilitatorService($q, appSettings) {

        var getFacilitatorService = function getFacilitatorService() {
            var deferredGet = $q.defer();
            var facilitatorService = {};
            facilitatorService.getFacilitators = getFacilitators;
            facilitatorService.getFacilitatorById = getFacilitatorById;
            deferredGet.resolve(facilitatorService);
            return deferredGet.promise;
        }

        function getFacilitators() {
            var getFacilitatorsApiUrl = appSettings.apiBaseAdminUrl + '/facilitators/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getFacilitatorsApiUrl, config)
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

        function getFacilitatorById(id) {
            var getFacilitatorByIdApiUrl = appSettings.apiBaseAdminUrl + '/facilitators/' + encodeURIComponent(id);
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getFacilitatorByIdApiUrl, config)
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

        
        return {
            get: getFacilitatorService
        };
    }
})();