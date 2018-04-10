(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .run(themeRun);

    /** @ngInject */
    function themeRun($timeout, $rootScope, layoutPaths, preloader, $q, baSidebarService, themeLayoutSettings, $window, $http) {
        $rootScope.username = null;
        $rootScope.password = null;
        var whatToWait = [
            preloader.loadAmCharts(),
            $timeout(3000),
            checkUserSession()
        ];

        var theme = themeLayoutSettings;
        if (theme.blur) {
            if (theme.mobile) {
                whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-mobile.jpg'));
            } else {
                whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg.jpg'));
                whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-blurred.jpg'));
            }
        }

        $q.all(whatToWait).then(function () {
            $rootScope.$pageFinishedLoading = true;
        });

        $timeout(function () {
            if (!$rootScope.$pageFinishedLoading) {
                $rootScope.$pageFinishedLoading = true;
            }
        }, 7000);

        function checkUserSession() {
            // perform some asynchronous operation, resolve or reject the promise when appropriate.
            return $q(function (resolve, reject) {
                var bearer = window.sessionStorage.getItem("bearer");
                if (bearer) {
                    $rootScope.$logged = true;
                    resolve(bearer);
                } else {
                    $rootScope.$logged = false;
                    // le mettre dans le resolve de cette promesse
                    reject("L'utilisateur n'est pas connecté");
                }
            });
        }

        $rootScope.signin = function (username,password) {
            return $q(function (resolve, reject) {
                var addUserClaimTask = $q.defer();
                $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                var signingUrl = 'http://51.136.10.20/mylearningback/api/auth/token';

                if (!signingUrl) {
                    var undefinedAddUserClaimApiUrlError = new hqaIdMApiError();
                    undefinedAddUserClaimApiUrlError.message = "L'adresse de l'API pour exécuter la création d'une revendication d'un utilisateur n'est pas définie.";

                    addUserClaimTask.reject(undefinedAddUserClaimApiUrlError);
                    return addUserClaimTask.promise;
                }

                var payload = new FormData();
                payload.append('username', 'averdier');
                payload.append('secret', 'averdier');

                axios.post(signingUrl, payload)
                    .then(signingComplete, signingFailed);


                function signingComplete(response) {
                    window.sessionStorage.setItem('bearer', response.data['access_token']);
                    console.log(response.data['access_token']);
                    //return response.data;
                }

            
                function signingFailed(reason) {
                    var httpAddUserClaimTask = $q.defer();

                    if (reason.status === 401) {
                        var unauthorizedError = new hqaIdMApiUnauthorizedError();
                        unauthorizedError.message = "Vous n'êtes pas autorisé à créer une revendication pour un utilisateur. Contactez votre administrateur fonctionnel pour vous accorder les droits. Si les droits viennent de vous être accordés, veuillez rafraîchir la page.";
                        unauthorizedError.innerError = reason;

                        httpAddUserClaimTask.reject(unauthorizedError);
                    } else if (reason.status === 404) {
                        var notFoundError = new hqaIdMApiError();
                        notFoundError.message = "L'API de gestion des revendications d'un utilisateur du gestionnaire des identités HQA n'est pas accessible.";
                        notFoundError.innerError = reason;

                        httpAddUserClaimTask.reject(notFoundError);
                    } else if (reason.status === 400) {
                        var idMApiError = new hqaIdMApiError();
                        idMApiError.message = reason.data.messages[0].message;
                        idMApiError.innerError = reason;

                        httpAddUserClaimTask.reject(idMApiError);
                    } else {
                        var unknownError = new hqaIdMApiError();
                        unknownError.message = "L'API de gestion des utilisateurs du gestionnaire des identités HQA n'est pas disponible (Statut HTTP: " + reason.status + "). " + reason.data.message + " " + reason.data.messageDetail;
                        unknownError.innerError = reason;

                        httpAddUserClaimTask.reject(unknownError);
                    }

                    return httpAddUserClaimTask.promise;
                }
            }, 1000);
        }
        $rootScope.$baSidebarService = baSidebarService;
    }

})();