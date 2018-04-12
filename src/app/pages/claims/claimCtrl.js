(function () {
    'use strict';

    angular.module('BlurAdmin.pages.claims')
        .controller('ClaimCtrl', ClaimCtrl);


    function ClaimCtrl($scope, claimService, $log, $q, authorizationService, appSettings, groupService, jwtHelper, $state, offerService, $stateParams, toastr) {
        var vm = this;

        // Service instance
        var claimServiceInstance = null;
        var groupServiceInstance = null;
        var offerServiceInstance = null;
        var authorizationServiceInstance = null;
        var offerServiceInstance = null;

        // User info
        var userInfos = jwtHelper.decodeToken(window.sessionStorage.getItem('bearer')).user;

        // Status
        vm.status = {
            "pending": "En attente de validation",
            "validated": "Terminée",
            "running": "En cours",
            "canceled": "Refusée par l'intervenant"
        }


        // Displayed Variables
        vm.claim = $stateParams.claim;
        if (!vm.claim) {
            $state.go('Claims.listclaims');
        } else {
            vm.userInfos = jwtHelper.decodeToken(sessionStorage.getItem('bearer')).user;
            vm.isFacilitator = vm.userInfos.type === 'facilitator';
            vm.isSudent = vm.userInfos.type === 'student';
            vm.CurrentClaimStatus = vm.claim.status;
        }

        var init = function () {
            ensureClaimService()
                .then(ensureAuthorizationService)
                .then(function () {
                    $scope.isReady = true;
                    if (!$scope.$$phase) {

                        $scope.$apply();
                    }

                }).catch(function (error) {
                    $log.error("Erreur", error);
                    $state.go('dashboard');
                });
        }

        init();


        vm.updateStatus = function (status) {
            claimServiceInstance.updateClaimStatus(vm.claim.offerId, vm.claim.claimId, status).then(function (res) {
                vm.CurrentClaimStatus = status;
                toastr.success("Le status de la demande a bien été changé");
            }).catch(function (error) {
                toastr.error("Erreur lors du changement de status de la demande");
                vm.CurrentClaimStatus = status;

                });
        }

        

        ///// FUNCTION ENSURE SERVICE /////

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

        function ensureOfferService() {

            var deferredClaimService = $q.defer();

            if (!offerServiceInstance) {
                offerService.get().then(function (offerService) {
                    offerServiceInstance = offerService;
                    if (offerServiceInstance)
                        deferredClaimService.resolve(offerServiceInstance);
                    else {
                        deferredClaimService.reject();
                    }
                });
            } else {
                deferredClaimService.resolve(offerServiceInstance);
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
        
    }
})();