(function () {
    'use strict';

    angular.module('BlurAdmin.pages.project', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('Projets',
            {
                url: '/projets',
                template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                controller: 'ProjectPageCtrl',
                controllerAs: 'projectCtrl',
                title: 'Projets',
                sidebarMeta: {
                    icon: 'ion-briefcase',
                    order: 400,
                    rights: 'canproject'
                }
            })
            .state('Projets.createproject', {
                url: '/createproject',
                title: 'Créer un projet',
                templateUrl: 'app/pages/projects/createProject.html',
                sidebarMeta: {
                    order: 0,
                    rights: 'cancreateproject'
                }
            })
            .state('Projets.listprojects', {
                url: '/myprojects',
                title: 'Mes projets',
                templateUrl: 'app/pages/projects/myProjects.html',
                controller: 'ProjectListCtrl',
                controllerAs: 'projectListCtrl',
                sidebarMeta: {
                    order: 1,
                    rights: 'canlistmyprojects'
                }
            })
            .state('Projets.campus', {
                url: '/campus',
                title: 'Projets de mon campus',
                templateUrl: 'app/pages/projects/campus.html',
                sidebarMeta: {
                    order: 2,
                    rights: 'canlistcampusprojects'
                }
            })
            .state('Projets.viewprojet',
            {
                url: '/viewprojet',
                title: 'Projet',
                templateUrl: 'app/pages/projects/viewproject.html',
                controller: 'ProjectCtrl',
                params: {
                    'project': null
                }
            });
        $urlRouterProvider.when('/project', '/project/createproject');
    }

})();
