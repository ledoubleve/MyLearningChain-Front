(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('chat', chat);

    /** @ngInject */
    function chat() {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/chat/chat.html',
            controller: 'ChatCtrl',
            controllerAs: 'vm',
            scope: {
                interventionId: '@prestation',
                claimId: '@claim',
                status: '=status'
            },
            bindToController: true
        };
    }

})();