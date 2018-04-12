(function () {
    'use strict';

    angular.module('BlurAdmin.pages.sections', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('Classes',
                {
                    url: '/classes',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    controller: 'CreateSectionPageCtrl',
                    controllerAs: 'createSectionCtrl',
                    title: 'Classes',
                    sidebarMeta: {
                        icon: 'ion-grid',
                        order: 300,
                        rights: 'canclass'
                    }
                })
            .state('Classes.createclasse', {
                url: '/createclasse',
                title: 'Créer une classe',
                templateUrl: 'app/pages/sections/createSection.html',
                sidebarMeta: {
                    icon: 'ion-grid',
                    order: 0,
                    rights: 'cancreateclasse'
                }
            });
        $urlRouterProvider.when('/users', '/users/createuser');
    }

})();
