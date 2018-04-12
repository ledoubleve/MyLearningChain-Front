/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',

    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.ui',
    'BlurAdmin.pages.components',
    'BlurAdmin.pages.form',
    'BlurAdmin.pages.user',
    "BlurAdmin.pages.facilitators",
    'BlurAdmin.pages.project',
    'BlurAdmin.pages.section',
    "BlurAdmin.pages.claims",
    "BlurAdmin.pages.campus",
      "BlurAdmin.pages.groupe"

  ])
      .config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
        $urlRouterProvider.otherwise('/dashboard');
    }

})();
