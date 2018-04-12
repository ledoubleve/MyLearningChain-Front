/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('ChatCtrl', ChatCtrl);

    /** @ngInject */
    function ChatCtrl($scope, $q, $sce, $log, chatService, jwtHelper, claimService, authorizationService, socketio, groupService) {
        console.log("scope", $scope);
        var vm = this;
        vm.messages = [];

        var groupServiceInstance = null;
        var claimServiceInstance = null;
        var authorizationServiceInstance = null;

        vm.userInfos = jwtHelper.decodeToken(sessionStorage.getItem('bearer'));

        // Claim link to tchat
        var claimInformations = {};

        // Group link to group 
        vm.groupInformations = {};
        var idGroupUser = [];
       

        var init = function () {

            chatService.getMessageByAssistanceId(vm.interventionId, vm.claimId)
                .then(function (messages) {
                    vm.messages = messages
                    return $q.resolve()
                })
                .then(ensureClaimService)
                .then(ensureAuthorizationService)
                .then(ensureGroupService)
                    .then(function () {
                        claimInformations = claimServiceInstance.getClaim(vm.interventionId, vm.claimId).then(function (data) {
                            claimInformations = data;
                            if (vm.userInfos.user.type === "student") {
                                groupServiceInstance.getGroupById(claimInformations.group.id).then(function (dataT) {
                                    vm.groupInformations = dataT;
                                    vm.groupInformations.students.forEach(function (stu) {
                                        if (stu.id != vm.userInfos.user.id) {
                                            idGroupUser.push(stu.id);
                                        }
                                    });
                                    idGroupUser.push(claimInformations.offer.facilitator_id);
                                    $scope.isReady = true;
                                    if (!$scope.$$phase) {

                                        $scope.$apply();
                                    }
                                        
                                });
                            } else {
                                groupServiceInstance.getGroupByIdAdmin(claimInformations.group.id).then(function (dataT) {
                                    vm.groupInformations = dataT;
                                    vm.groupInformations.students.forEach(function (stu) {
                                            idGroupUser.push(stu.id);
                                    });
                                    $scope.isReady = true;
                                    if (!$scope.$$phase) {

                                        $scope.$apply();
                                    }
                                });
                            }
                        });
                        
                        // init id user
                         
                    });

            //// When receive a new message
            socketio.client.on('newMessage', function (data) {
                $log.debug("newMessage", data);
                vm.messages.push({
                    id: data.messageId,
                    text: data.message,
                    date: data.creationDate,
                    userName: data.senderName,
                    userId: data.senderId
                });
            });
        }

       
        vm.currentUser = {
            userId: vm.userInfos.user.id,
            avatar: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
            userName: vm.userInfos.user.first_name + " " + vm.userInfos.user.last_name
        };

        vm.sendMessage = function (msg) {
            console.log("send message", msg);
            vm.messages.push(msg);
            chatService.sendMessage(msg.text).then(function (data) {
                // When receive a new message
                socketio.client.emit('newMessage', {
                        assistance: claimInformations.offer.name,
                        message: msg.text,
                        messageId: data.id,
                        creationDate: data.created_at,
                        senderName: vm.currentUser.userName,
                        senderId: vm.currentUser.userId,
                        userIds: idGroupUser.filter(function (item) { return item !== vm.currentUser.userId })
                    });      
            });
        }


        // Service
        function ensureClaimService() {
            
            var deferredClaimService = $q.defer();
            
            if (!claimServiceInstance) {
                claimService.get().then(function (claimService) {
                    claimServiceInstance = claimService;
                    if (claimServiceInstance)
                        deferredClaimService.resolve(claimServiceInstance);
                    else {
                        deferredClaimService.reject();
                    }
                });
            } else {
                deferredClaimService.resolve(claimServiceInstance);
            }

            return deferredClaimService.promise;

        }


        function ensureGroupService() {

            var deferredGroupService = $q.defer();

            if (!groupServiceInstance) {
                groupService.get().then(function (groupService) {
                    groupServiceInstance = groupService;
                    if (groupServiceInstance)
                        deferredGroupService.resolve(groupServiceInstance);
                    else {
                        deferredGroupService.reject();
                    }
                });
            } else {
                deferredGroupService.resolve(groupServiceInstance);
            }

            return deferredGroupService.promise;

        }

        

        function ensureAuthorizationService() {
            var deferredAuthorizationService = $q.defer();

            // Obtient le service de gestion des autorisations
            if (!authorizationServiceInstance) {
                authorizationService.get().then(function (authorizationService) {
                    authorizationServiceInstance = authorizationService;
                    if (authorizationServiceInstance)
                        deferredAuthorizationService.resolve(authorizationServiceInstance);
                    else {
                        deferredAuthorizationService.reject();
                    }
                });
            } else {
                deferredAuthorizationService.resolve(authorizationServiceInstance);
            }
            return deferredAuthorizationService.promise;
        }

        init();
    }

})();