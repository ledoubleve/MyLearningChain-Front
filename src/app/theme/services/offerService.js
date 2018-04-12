(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('offerService', offerService);

    offerService.$inject = ['$q', 'appSettings'];
    /** @ngInject */
    function offerService($q, appSettings) {
        var authorizationServiceInstance = null;
        var getOfferService = function getOfferService() {
            var deferredGet = $q.defer();
            var offerService = {};
            offerService.createOffer = createOffer;
            offerService.claimAnOffer = claimAnOffer;
            offerService.getOffer = getOffer;
            deferredGet.resolve(offerService);
            return deferredGet.promise;
        }

        function createOffer(offerProperties) {
            var createOfferApiUrl = appSettings.apiBasePubUrl + '/offers/';
            var config = {
                headers: { 'Authorization': "bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.post(createOfferApiUrl, offerProperties, config)
                .then(requestComplet, requestFailed);

            function requestComplet(response) {
                return response;
            }

            function requestFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }
        }

        function claimAnOffer(offerId, groupId, message) {
            var claimOfferApiUrl = appSettings.apiBasePubUrl + '/offers/' + encodeURIComponent(offerId) + '/claims';
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            var body = {
                group: groupId,
                message: message
            }
            return axios.post(claimOfferApiUrl, body, config)
                .then(claimComplete, claimFailed);

            function claimComplete(response) {
                return response;
            }

            function claimFailed(reason) {
                var httpCreationTask = $q.defer();
                httpCreationTask.reject(reason);
                return httpCreationTask.promise;
            }

        }

        function deleteOffer(offerId) {
            var deleteOfferApiUrl = appSettings.apiBasePubUrl + `/offers/${offerId}`;
            var config = {
                headers: { 'Authorization': "bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.delete(deleteOfferApiUrl, config)
                .then(requestComplet, requestFailed);
        }

        function getOffer(offerId) {
            var getOfferApiUrl = appSettings.apiBasePubUrl + `/offers/${offerId}`;
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            return axios.get(getOfferApiUrl, config)
                .then(function (response) { return $q.resolve(response.data);  }, requestFailed);
        }

        // CALLBACK Offer
        function requestComplet(response) {
            return response;
        }

        function requestFailed(reason) {
            var httpCreationTask = $q.defer();
            httpCreationTask.reject(reason);
            return httpCreationTask.promise;
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
        return {
            get: getOfferService
        };
    }
})();