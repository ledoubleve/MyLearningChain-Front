(function () {
    'use strict';

    angular.module('BlurAdmin.pages.claims', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Claims', {
                url: '/claim',
                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'Demandes',
                sidebarMeta: {
                    icon: 'ion-chatboxes',
                    order: 300,
                    rights: 'canclaim'
                }
            })
            .state('Claims.listclaims',
            {
                url: '/listclaims',
                title: 'Mes demandes',
                templateUrl: 'app/pages/claims/claims.html',
                controller: 'ClaimsCtrl',
                controllerAs: 'ClaimsCtrl',
                sidebarMeta: {
                    order: 0,
                    icon: 'ion-information',
                    rights : 'canlistclaim'
                }
            })
            .state('Claims.viewclaim',
            {
                url: '/viewclaim',
                title: 'Demande d\'assistance',
                templateUrl: 'app/pages/claims/viewClaim.html',
                controller: 'ClaimCtrl',
                controllerAs: 'ClaimCtrl',
                params: {
                    'claim': null
                }
            })
            .state('Claims.askClaim',
            {
                url: '/listfacilitators',
                title: 'Faire une demande',
                templateUrl: 'app/pages/facilitator/listFacilitator.html',
                controller: 'FacilitatorListCtrl',
                controllerAs: 'facilitatorListCtrl',
                sidebarMeta: {
                    order: 0,
                    icon: 'ion-perso,-stalker'
                }
                    
                });
    }

})();
