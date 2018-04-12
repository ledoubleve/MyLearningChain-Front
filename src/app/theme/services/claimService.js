(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('claimService', claimService);

    claimService.$inject = ['$q', 'appSettings'];
    /** @ngInject */
    function claimService($q, appSettings) {

        var getClaimService = function getClaimService() {
            var deferredGet = $q.defer();
            var claimService = {};
            claimService.createClaim = createClaim;
            claimService.updateClaimStatus = updateClaimStatus;
            claimService.getClaim = getClaim;
            claimService.getClaims = getClaims;
            deferredGet.resolve(claimService);
            return deferredGet.promise;
        }

        function createClaim(idOffer,claimProperties) {
            var createClaimApiUrl = appSettings.apiBasePubUrl + '/offers/{id}/claims';
            createClaimApiUrl = createClaimApiUrl.replace('{id}', encodeURIComponent(idOffer));
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.post(createClaimApiUrl, claimProperties, config)
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

        

        function updateClaimStatus(idOffer, idClaim, status) {
            var updateClaimStatutApiUrl = appSettings.apiBasePubUrl + '/offers/{id}/claims/{cid}';
            updateClaimStatutApiUrl = updateClaimStatutApiUrl.replace('{id}', encodeURIComponent(idOffer));
            updateClaimStatutApiUrl = updateClaimStatutApiUrl.replace('{cid}', encodeURIComponent(idClaim));

            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            }

            return axios.put(updateClaimStatutApiUrl, { "status": status }, config).then(function (response) {
                return $q.resolve(response.data);
            }).catch(function (error) {
                return $q.reject(error);
            });
        }

        function getClaim(idOffer, idClaim) {
            var getClaimApiUrl = appSettings.apiBasePubUrl + '/offers/{id}/claims/{cid}';
            getClaimApiUrl = getClaimApiUrl.replace('{id}', encodeURIComponent(idOffer));
            getClaimApiUrl = getClaimApiUrl.replace('{cid}', encodeURIComponent(idClaim));

            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getClaimApiUrl, config)
                .then(getComplete, getFailed);

            function getComplete(response) {
                return response.data;
            }

            function getFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        function getClaims(idOffer) {
            var getClaimApiUrl = appSettings.apiBasePubUrl + '/offers/{id}/claims';
            getClaimApiUrl = getClaimApiUrl.replace('{id}', encodeURIComponent(idOffer));

            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getClaimApiUrl, config)
                .then(getComplete, getFailed);

            function getComplete(response) {
                return response.data;
            }

            function getFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        return {
            get: getClaimService
        };
    }
})();