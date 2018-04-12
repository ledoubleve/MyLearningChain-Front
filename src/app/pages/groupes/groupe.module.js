(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupe', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('Group',
            {
                url: '/group',
                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                controller: 'GroupePageCtrl',
                controllerAs: 'groupeCtrl',
                title: 'Groupes',
                sidebarMeta: {
                    icon: 'ion-ios-people',
                    order: 300,
                    rights: 'cangroup'
                }
            })
            .state('Group.creategroup', {
                url: '/creategroup',
                title: 'Créer un groupe',
                templateUrl: 'app/pages/groupes/createGroupe.html',
                sidebarMeta: {
                    order: 0,
                    rights: 'cancreategroup'
                }
            })
            .state('Group.linkgroupuser', {
                url: '/linkgroupuser',
                title: 'Lier un utilisateur',
                templateUrl: 'app/pages/groupes/addUserToGroup.html',
                sidebarMeta: {
                    order: 1,
                    rights: 'canlinkgroup'
                }
            })
            .state('Group.listgroup', {
                url: '/listgroup',
                title: 'Liste des groupes',
                templateUrl: 'app/pages/groupes/listGroups.html',
                controller: 'ListGroupeCtrl',
                controllerAs: 'groupListCtrl',
                sidebarMeta: {
                    order: 1,
                    rights: 'canlistgroups'
                }
            })
            .state('Group.listmygroup', {
                url: '/listmygroup',
                title: 'Mes groupes',
                templateUrl: 'app/pages/groupes/list',
                controller: 'ListMyGroupCtrl',
                controllerAs: 'ListMyGroupCtrl',
                sidebarMeta: {
                    order: 1,
                    rights: 'canlistmygroups'
                }
            });
        $urlRouterProvider.when('/group', '/group/creategroup');
    }

})();
