(function () {
    'use strict';

    angular.module('BlurAdmin.pages.campus', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('Campus',
            {
                url: '/campus',
                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                controller: 'CampusPageCtrl',
                controllerAs: 'campusCtrl',
                title: 'Campus',
                sidebarMeta: {
                    icon: 'ion-ios-home',
                    order: 300,
                    rights: 'cancampus'
                }
            })
            .state('Campus.createcampus', {
                url: '/createcampus',
                title: 'Créer un campus',
                templateUrl: 'app/pages/campus/createCampus.html',
                sidebarMeta: {
                    order: 1,
                    rights: 'cancreatecampus'
                }
            })
            .state('Campus.listcampus',
            {
                url: '/listcampus',
                title: 'Les campus',
                templateUrl: 'app/pages/campus/listCampus.html',
                controller: 'CampusListCtrl',
                controllerAs: 'campusListCtrl',
                sidebarMeta: {
                    order: 0,
                    rights: 'canlistcampus'
                }
            })
            .state('Campus.viewcampus',
            {
                url: '/viewcampus',
                title: 'Campus',
                templateUrl: 'app/pages/campus/viewCampus.html',
                controller: 'CampusCtrl',
                params: {
                    'campus': null
                }
            });
        $urlRouterProvider.when('/campus', '/section/createcampus');
    }

})();
