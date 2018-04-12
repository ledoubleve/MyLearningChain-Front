

(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('authorizationService', authorizationService);

    // Injecte les dépendances
    authorizationService.$inject = ["$http", "$q", "appSettings"];

    function authorizationService($http, $q, appSettings) {
        
        var getAuthorizationService = function getAuthorizationService() {
            var deferredGet = $q.defer();

            var authorizationService = {};

            authorizationService.get = getAuthorizations;
            authorizationService.verify = verifySignature;

            authorizationService.roles = getAuthorizations();
            deferredGet.resolve(authorizationService);
            return deferredGet.promise;
        }

        function getAuthorizations() {
            var getTask = $q.defer();

            var token = window.sessionStorage.getItem("bearer");
            var verifyUrl = "http://mlcback.westeurope.cloudapp.azure.com/auth/api/auth/verify_token";
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            var body = { "access_token": token };
            var authorizations = {};

            if (token == null || token == undefined) {
                return {};
            } else {
                return axios.post(verifyUrl, body, config)
                    .then(function (response) {
                        authorizationService.roles = response.data.user.scopes;
                        authorizationService.getUserId = getUserId;
                        return response.data.user.scopes;
                    }, function (reason) {
                        return reason;
                    });
            }
        }

        function getUserId() {
            var getTask = $q.defer();

            var token = window.sessionStorage.getItem("bearer");
            var verifyUrl = "http://mlcback.westeurope.cloudapp.azure.com/auth/api/auth/verify_token";
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            var body = { "access_token": token };
            var authorizations = {};

            if (token == null || token == undefined) {
                return {};
            } else {
                return axios.post(verifyUrl, body, config)
                    .then(function (response) {
                        authorizationService.roles = response.data.user.scopes;
                        return response.data.user.id;
                    }, function (reason) {
                        return reason;
                    });
            }
        }

        function verifySignature(token) {
            var verifyTask = $q.defer();
            var verifyUrl = "http://mlcback.westeurope.cloudapp.azure.com/auth/api/auth/verify_token";

            if (!verifyUrl) {
                verifyTask.reject("L'url de verification du token n'est pas définie");
                return verifyTask.promise;
            }
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            };
            var body = { "access_token": token };

            return axios.post(verifyUrl, body, config)
                .then(verifyComplete, verifyFailed);

            function verifyComplete(response) {
                window.sessionStorage.setItem("bearer", token);
                return true;
            }

            function verifyFailed(reason) {
                var httpVerifyTokenTask = $q.defer();
                window.sessionStorage.removeItem("bearer");
                httpVerifyTokenTask.reject("Erreur lors de la verification du jeton");

                return false;
            }
        }

        return {
            get: getAuthorizationService
        }
    }

    ;
})();