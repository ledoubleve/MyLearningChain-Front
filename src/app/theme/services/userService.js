/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('userService', userService);

    userService.$inject = ['$q','authorizationService'];
    /** @ngInject */
    function userService($q, authorizationService) {

        var getUserService = function getUserService() {
            var deferredGet = $q.defer();
            var authorizations = authorizationService.get();

            return deferredGet.promise;

            function getApiMetadataComplete(api) {
                var userService = api;
                deferredGet.resolve(userService);

                ctrl.canQueryGroup = authorizationService.canQueryGroups

            }

            function getApiMetadataFailed(reason) {
                var getApiAuthorizationTask = $q.defer();
                getApiAuthorizationTask.reject(reason);
                return getApiAuthorizationTask.promise;
            }
        }


        return {
            get: getUserService
        };
    }
})();