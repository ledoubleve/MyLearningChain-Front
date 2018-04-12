/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.charts', [
      'BlurAdmin.pages.charts.amCharts',
      'BlurAdmin.pages.charts.chartJs',
      'BlurAdmin.pages.charts.chartist',
      'BlurAdmin.pages.charts.morris'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
  }

})();
