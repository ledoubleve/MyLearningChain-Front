(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('groupService', groupService);

    groupService.$inject = ['$q', 'appSettings', "$log"];
    /** @ngInject */
    function groupService($q, appSettings, $log) {

        var getGroupService = function getGroupService() {
            var deferredGet = $q.defer();
            var groupService = {};
            groupService.getGroupById = getGroupById;
            groupService.getMyGroups = getMyGroups;
            groupService.getGroupsOfUser = getGroupsOfUser;
            groupService.createGroup = createGroup;
            groupService.getGroupByIdAdmin = getGroupByIdAdmin;
            groupService.getGroups = getGroups;
            groupService.linkGroupAndUser = linkGroupAndUser;
            deferredGet.resolve(groupService);
            return deferredGet.promise;
        }

        function linkGroupAndUser(populationProperties) {
            var createGroupApiUrl = appSettings.apiBaseAdminUrl + '/groups/' + encodeURIComponent(populationProperties.id) + '/students/'+encodeURIComponent(populationProperties.sid);
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.post(createGroupApiUrl, null, config)
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

        function createGroup(groupProperties) {
            var createGroupApiUrl = appSettings.apiBaseAdminUrl + '/groups/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.post(createGroupApiUrl, groupProperties, config)
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

        function getMyGroups() {
            var getGroupsApiUrl = appSettings.apiBasePubUrl + '/groups/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getGroupsApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                return response.data.groups;
            }

            function queryFailed(reason) {
                if (reason.response.data.error === "Not authorized") {
                    return [];
                }
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        function getGroups() {
            var getGroupsApiUrl = appSettings.apiBaseAdminUrl + '/groups/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getGroupsApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                return response.data.groups;
            }

            function queryFailed(reason) {
                if (reason.response.data.error === "Not authorized") {
                    return [];
                }
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        function getGroupById(id) {
            var getGroupByIdApiUrl = appSettings.apiBasePubUrl + '/groups/' + encodeURIComponent(id);
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getGroupByIdApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                return $q.resolve(response.data);
            }

            function queryFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }

        }

        function getGroupByIdAdmin(id) {
            var getGroupByIdApiUrl = appSettings.apiBaseAdminUrl + '/groups/' + encodeURIComponent(id);
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getGroupByIdApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                return $q.resolve(response.data);
            }

            function queryFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }

        }

        function getGroupsOfUser(id) {
            var getGroupsApiUrl = appSettings.apiBasePubUrl + '/groups/';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getGroupsApiUrl, config)
                .then(queryComplete, queryFailed);

            function queryComplete(response) {
                // Récupération des claims d'un groupe
                var promises = [];
                response.data.groups.forEach(function (grp) {
                    promises.push(getGroupById(grp.id));
                });
                return $q.all(promises).then(function (responses) {
                    var groups = [];
                    responses.forEach(function (response) {
                        groups.push(response);
                    })
                    return $q.resolve(groups);
                }).catch(function (error) {
                    $log.error("Erreur lors de la récupération des groupes d'un utilisateurs", error);
                    return $q.reject(error);
                });
            }

            function queryFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }

        }

        return {
            get: getGroupService
        };
    }
})();