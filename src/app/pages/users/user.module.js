(function () {
    'use strict';

    angular.module('BlurAdmin.pages.user', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('Utilisateurs',
                {
                    url: '/users',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    controller: 'UserPageCtrl',
                    controllerAs: 'userCtrl',
                    title: 'Utilisateurs',
                    sidebarMeta: {
                        icon: 'ion-person-stalker',
                        order: 300,
                        rights: 'canuser'
                    }
                })
            .state('Utilisateurs.createuser', {
                url: '/createuser',
                title: 'Créer un utilisateur',
                templateUrl: 'app/pages/users/createUser.html',
                sidebarMeta: {
                    order: 0,
                    rights: 'cancreateuser'
                }
            });
        $urlRouterProvider.when('/users', '/users/createuser');
    }

})();
