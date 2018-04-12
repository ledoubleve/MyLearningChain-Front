(function () {
    'use strict';

    angular.module('BlurAdmin.pages.section', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('Section',
                {
                    url: '/section',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    controller: 'SectionPageCtrl',
                    controllerAs: 'sectionCtrl',
                    title: 'Classes',
                    sidebarMeta: {
                        icon: 'fa fa-graduation-cap',
                        order: 300,
                        rights: 'cansection'
                    }
                })
            .state('Section.createsection', {
                url: '/createsection',
                title: 'Créer une classe',
                templateUrl: 'app/pages/section/createSection.html',
                sidebarMeta: {
                    order: 0,
                    rights: 'cancreatesection'
                }
            });
        $urlRouterProvider.when('/section', '/section/createsection');
    }

})();
