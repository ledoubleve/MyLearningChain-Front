(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('sectionService', sectionService);

    sectionService.$inject = ['$q', 'appSettings'];
    /** @ngInject */
    function sectionService($q, appSettings) {

        var getSectionService = function getSectionService() {
            var deferredGet = $q.defer();
            var sectionService = {};
            sectionService.createSection = createSection;
            sectionService.listSections = listSections;
            deferredGet.resolve(sectionService);
            return deferredGet.promise;
        }

        function createSection(sectionProperties) {
            var createSectionApiUrl = appSettings.apiBaseAdminUrl + '/sections/';
            var config = {
                headers: { 'Authorization': "bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.post(createSectionApiUrl, sectionProperties, config)
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

        function listSections() {
            var listSectionApiUrl = appSettings.apiBaseAdminUrl + '/sections/';
            var config = {
                headers: { 'Authorization': "bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(listSectionApiUrl, config)
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

        return {
            get: getSectionService
        };
    }
})();