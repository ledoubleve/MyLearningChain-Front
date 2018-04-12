(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .run(themeRun);

    /** @ngInject */
    function themeRun($timeout, $rootScope, layoutPaths, preloader, $q, baSidebarService, themeLayoutSettings, authorizationService, $state, jwtHelper, appSettings, $window) {
        $rootScope.username = null;
        $rootScope.password = null;
        var authorizationServiceInstance = null;
        var whatToWait = [
            preloader.loadAmCharts(),
            $timeout(1000),
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
        }, 4000);

        function checkUserSession() {
            ensureAuthorizationService().then(function() {
                // perform some asynchronous operation, resolve or reject the promise when appropriate.
                return $q(function (resolve, reject) {
                    var bearer = window.sessionStorage.getItem("bearer");

                    if ((bearer != null) && (bearer != "null") && (bearer != undefined) && (bearer != "undefined")) {

                        if (authorizationServiceInstance.verify(bearer) && !jwtHelper.isTokenExpired(bearer)) {
                            $rootScope.$logged = true;
                            resolve(bearer);
                        } else {
                            window.sessionStorage.removeItem('bearer');
                            $state.go('dashboard');
                        }
                    } else {
                        $rootScope.$logged = false;
                        // le mettre dans le resolve de cette promesse
                        reject("L'utilisateur n'est pas connecté");
                    }
                });
            });
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


        $rootScope.signin = function (username,password) {
            return $q(function (resolve, reject) {
                var verifyTokenTask = $q.defer();
                var signingUrl = appSettings.apiBaseApiUrl + '/auth/token';

                var payload = new FormData();
                payload.append('username', username);
                payload.append('secret', password);

                axios.post(signingUrl, payload)
                    .then(signingComplete, signingFailed);


                function signingComplete(response) {
                    window.sessionStorage.setItem('bearer', response.data['access_token']);
                    $rootScope.$logged = true;
                    $state.reload();
                    return response.data['access_token'];
                }

            
                function signingFailed(reason) {
                    var httpVerifyTokenTask = $q.defer();
                    window.sessionStorage.removeItem("bearer");

                    httpVerifyTokenTask.reject("Erreur lors de la verification du jeton");
                    $('#loginError').css('display', 'block');
                    return httpVerifyTokenTask.promise;
                }
            },500);
        }

        $rootScope.signout = function() {
            window.sessionStorage.removeItem("bearer");
            $window.location.reload();
        }

        $rootScope.$baSidebarService = baSidebarService;
    }

})();