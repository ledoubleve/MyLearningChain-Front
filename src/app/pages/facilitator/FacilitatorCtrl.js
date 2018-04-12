(function () {
    'use strict';

    angular.module('BlurAdmin.pages.facilitators')
        .controller('FacilitatorCtrl', FacilitatorCtrl);


    function FacilitatorCtrl($scope, $q, $stateParams, facilitatorService, $log, $state, $uibModal, toastr, authorizationService, offerService, jwtHelper, groupService) {
        $scope.isReady = false;
        var facilitatorServiceInstance = null;
        var authorizationServiceInstance = null;
        var offerServiceInstance = null;
        var groupServiceInstance = null;

        var facilitator = $stateParams.facilitator;


        // next Offer creation
        $scope.newOffer = {
            name: "",
            price: 0
        }

        // facilitator à afficher
        $scope.facilitator = {};

        // current selectedOffer
        $scope.selectedOffer = {};

        // ################# MODAL SECTION ############################### ///
        // Affichage de la modale de demande de presta
        // TODO: seulement si c'est un étudiant
        $scope.open = function (offer) {
            $scope.selectedOffer = offer;
            $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/facilitator/confirmClaimsModal.html',
                size: 'md',
                scope: $scope
            });
        };

        // Affichage de la modale de confirmation de supression d'une presta
        $scope.confirmDelete = function (offer) {
            $scope.selectedOffer = offer;
            $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/facilitator/confirmDeleteModal.html',
                size: 'md',
                scope: $scope
            });
        }

        $scope.creation = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/facilitator/createOfferModal.html',
                size: 'md',
                scope: $scope
            });
        }

        /////////////////////////////////////////////////////////////////////////

        $scope.askForAnOffer = function (offerId) {

            offerServiceInstance.claimAnOffer(offerId, $scope.selectedOffer.group.id, $scope.selectedOffer.message).then(function (response) {
                    toastr.info("La création de votre prestation a bien été prise en compte");
                },
                function (reason) {
                    if (reason.response.data.errors) {
                        toastr.error("Erreurs lors de la création : " + JSON.stringify(reason.response.data.errors));
                    } else {
                        toastr.error("Erreur lors de la création : " + JSON.stringify(reason.response.data.error));
                    }
                });
            

        }

        $scope.deleteOffer = function () {
            // TODO intégration api
            toastr.error("Votre offre de prestation a bien été supprimée");
        }


        $scope.createOffer = function () {
            offerServiceInstance.createOffer($scope.newOffer).then(function (response) {
                    $scope.facilitator.offers.push(response.data);
                    toastr.info("La création de votre prestation a bien été prise en compte");
                },
                function (reason) {
                    toastr.error("Erreur : " + reason.error);
                });
            $scope.newOffer = {
                name: "",
                price: 0
            }
        }


        ensureFacilitatorService()
            .then(ensureAuthorizationService())
            .then(ensureOfferService())
            .then(ensureGroupService())
            .then(function () {
                authorizationServiceInstance.get().then(function (roles) { mapRoles(roles); }).then(function () {
                    if ($scope.canreadfacilitator) {

                        if (!facilitator || facilitator.id == null || facilitator.id == undefined || facilitator.id == "") {
                            $state.go('dashboard');
                        }

                        facilitatorServiceInstance.getFacilitatorById(facilitator.id).then(function (facilitator) {
                            getMyGroupsDetails();
                            $scope.facilitator = correctImage(facilitator);
                            var decodeToken = jwtHelper.decodeToken(sessionStorage.getItem('bearer'));
                            $scope.isMe = decodeToken.user.id === facilitator.id;
                            $scope.isFacilitator = decodeToken.user.type == "facilitator";
                            $scope.isReady = true;
                            if (!$scope.$$phase) {

                                $scope.$apply();
                            }
                        });
                    }
                });
            }, function (error) { console.log(error) });

        function mapRoles(roles) {
            $scope.canreadfacilitator = (roles.indexOf("canreadfacilitator") != -1);
            $scope.canClaimOffer = (roles.indexOf("canclaimoffer") != -1);
        }

        function correctImage(facilitator) {
            if (!facilitator.img_uri == null || facilitator.img_uri == "") {
                element.img_uri = "https://www.w3schools.com/howto/img_avatar.png";
            }
            return facilitator;
        }
        
        function getMyGroupsDetails() {
            $scope.myGroups = [];
            groupServiceInstance.getMyGroups().then(function(groups) {
                var groupsNoDetails = angular.copy(groups);
                groupsNoDetails.forEach(function(element) {
                    groupServiceInstance.getGroupById(element.id).then(function(detail) {
                        $scope.myGroups.push(detail);
                    })
                });
            });
        }
        function ensureFacilitatorService() {
            var deferredFacilitatorService = $q.defer();

            // Obtient le service de gestion des intervenants.
            if (!facilitatorServiceInstance) {
                facilitatorService.get().then(function (facilitatorService) {
                    facilitatorServiceInstance = facilitatorService;
                    if (facilitatorServiceInstance)
                        deferredFacilitatorService.resolve(facilitatorServiceInstance);
                    else {
                        deferredFacilitatorService.reject();
                    }
                });
            } else {
                deferredFacilitatorService.resolve(facilitatorServiceInstance);
            }

            return deferredFacilitatorService.promise;

        }

        function ensureOfferService() {
            var deferredOfferService = $q.defer();

            // Obtient le service de gestion des offres.
            if (!offerServiceInstance) {
                offerService.get().then(function (offerService) {
                    offerServiceInstance = offerService;
                    if (offerServiceInstance)
                        deferredOfferService.resolve(offerServiceInstance);
                    else {
                        deferredOfferService.reject();
                    }
                });
            } else {
                deferredOfferService.resolve(offerServiceInstance);
            }

            return deferredOfferService.promise;

        }

        function ensureGroupService() {
            var deferredGroupService = $q.defer();

            // Obtient le service de gestion des groupes.
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
