/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .controller('MsgCenterCtrl', MsgCenterCtrl);

  /** @ngInject */
  function MsgCenterCtrl($scope, $sce, socketio, $log) {

 
      // connection to socket server 

      // When receive a new message
      socketio.client.on('newMessage', function (data) {
          $log.debug("newMessage", data);
          var notifType = getNotifByType("newMessage");
          var notifMessage = notifType.template.replace("&name", data.senderName).replace("&assistance", data.assistance);
          $scope.$apply(function () {
              $scope.notifications.push({
                  message: notifMessage,
                  sender: data.project,
                  icon: notifType.icon,
                  href: notifType.href.replace("&id", data.assistance)
              });
          });
      });

      // When receive an assistance demand
      socketio.client.on('needAssistance', function (data) {
          $log.debug("needAssistance", data);
          var notifType = getNotifByType("needAssistance");
          var notifMessage = notifType.template.replace("&teamName", data.teamName).replace("&projectName", data.projectName);
          $scope.$apply(function () {
              $scope.notifications.push({
                  message: notifMessage,
                  sender: data.project,
                  icon: notifType.icon,
                  href: notifType.href.replace("&id", data.teamName)
              });
          });
      });

    $scope.notificationTemplates = [
        {
            type: "newMessage",
            href: "#/claim/listclaims/&id",
            icon: "fa fa-comment-o",
            template: 'Nouveau message ! Demande d\'assistance <b>&assistance</b>'
        },
        {
            type: "needAssistance",
            href: "#/claim/listclaims/&id",
            icon: "fa fa-info",
            template: "<b>&teamName</b> ont besoin d'une assistance sur le projet <b>&projectName</b>"
        },

    ];

    $scope.notifications = [] // notification to show to user


    var getNotifByType = function (type) {
        return $scope.notificationTemplates.filter(function (item) { return item.type === type })[0];
    }
  }
})();