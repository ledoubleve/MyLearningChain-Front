(function () {
  'use strict';

  angular.module('BlurAdmin.pages.login')
    .controller('LoginPageCtrl', LoginPageCtrl);

  /** @ngInject */
  function LoginPageCtrl($scope, fileReader, $filter, $uibModal) {

    

      $scope.user = {
          username: "rlardier",
          password: "password"
      };
  }
});
