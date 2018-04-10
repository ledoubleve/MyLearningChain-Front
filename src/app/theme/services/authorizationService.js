

(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('authorizationService', authorizationService);

    // Injecte les dépendances
    authorizationService.$inject = ["$http", "jwtHelper", "$q"];

    function authorizationService($http, jwtHelper, $q, $state) {
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        function getAuthorizations() {
            var token = window.sessionStorage.getItem("bearer");
            if (token == null) {
                return new {};
            }


            verifySignature(token);


            var tokenPayload = jwtHelper.decodeToken(token);

            var authorization = {};

            // mappe les roles
            return tokenPayload;
        }

        function verifySignature(token) {
            var verifyTask = $q.defer();

            var verifyUrl = "http://51.136.10.20/mylearningback/pub/auth/verify_token";
            if (!verifyUrl) {
                verifyTask.reject("L'url de verification du token n'est pas définie");
                return verifyTask.promise;
            }

            var body = { "access_token": token };
            
            return axios.post(verifyUrl, body)
                .then(verifyComplete, verifyFailed);

            function verifyComplete(response) {
                window.sessionStorage.setItem("bearer", token);
                return true;
            }

            function verifyFailed(reason) {
                var httpVerifyTokenTask = $q.defer();
                window.sessionStorage.setItem("bearer", null);
                httpVerifyTokenTask.reject("Erreur lors de la verification du jeton");

                return false;
            }
        }

        return {
            get: getAuthorizations,
            verify: verifySignature
        };
    }
})();