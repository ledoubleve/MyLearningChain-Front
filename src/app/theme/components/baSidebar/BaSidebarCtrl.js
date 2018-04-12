/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    function BaSidebarCtrl($scope, baSidebarService, authorizationService, $q) {
        var authorizationServiceInstance = null;

        ensureAuthorizationService().then(function () {
            authorizationServiceInstance.get().then(function(response) {

                var baseItems = baSidebarService.getStateItems();
                var items = [];
                baseItems.forEach(function (item) {
                    if (item.sidebarMeta && item.sidebarMeta.rights) {
                        if (response.indexOf(item.sidebarMeta.rights) !== -1) {
                            items.push(item);
                        }
                    } else {
                        items.push(item);
                    }
                });


                $scope.menuItems = baSidebarService.getMenuItems(items);
                $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

                $scope.hoverItem = function ($event) {
                    $scope.showHoverElem = true;
                    $scope.hoverElemHeight = $event.currentTarget.clientHeight;
                    var menuTopValue = 66;
                    $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
                };

                $scope.$on('$stateChangeSuccess', function () {
                    if (baSidebarService.canSidebarBeHidden()) {
                        baSidebarService.setMenuCollapsed(true);
                    }
                });
            });
        });

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
    }
})();