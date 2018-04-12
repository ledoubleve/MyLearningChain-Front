//(function () {
//    'use strict';

//    angular.module('BlurAdmin.pages.offers', [])
//        .config(routeConfig);

//    /** @ngInject */
//    function routeConfig($stateProvider) {
//        $stateProvider
//            .state('Offers', {
//                url: '/offers',
//                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
//                abstract: true,
//                templateUrl: 'app/pages/facilitator/facilitator.html',
//                controller: 'FacilitatorListCtrl',
//                controllerAs: 'facilitatorListCtrl',
//                title: 'Intervenants',
//                sidebarMeta: {
//                    icon: 'ion-grid',
//                    order: 300,
//                    rights: 'canfacilitator'
//                }
//            })
//            .state('Facilitators.listfacilitators',
//                {
//                    url: '/listfacilitators',
//                    title: 'Liste',
//                    templateUrl: 'app/pages/facilitator/listFacilitator.html',
//                    controller: 'FacilitatorListCtrl',
//                    controllerAs: 'facilitatorListCtrl',
//                    sidebarMeta: {
//                        order: 0,
//                        icon: 'ion-perso,-stalker',
//                        rights: 'canlistfacilitator'
//                    }
//                })
//            .state('Facilitators.viewfacilitator',
//                {
//                    url: '/viewfacilitator',
//                    title: 'Intervenant',
//                    templateUrl: 'app/pages/facilitator/viewFacilitator.html',
//                    controller: 'FacilitatorCtrl',
//                    params: {
//                        'facilitator': null
//                    }
//                });
//    }

//})();
