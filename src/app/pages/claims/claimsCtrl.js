(function () {
    'use strict';

    angular.module('BlurAdmin.pages.claims')
        .controller('ClaimsCtrl', ClaimsCtrl);


    function ClaimsCtrl($scope, claimService, $log, $q, authorizationService, appSettings, groupService, jwtHelper, $state, offerService, facilitatorService, projectService) {
        var vm = this;
        vm.isReady = false;

        // Service instance
        var claimServiceInstance = null;
        var groupServiceInstance = null;
        var offerServiceInstance = null;
        var authorizationServiceInstance = null;
        var facilitatorServiceInstance = null;
        var projectServiceInstance = null;


        // User info
        var userInfos = jwtHelper.decodeToken(sessionStorage.getItem('bearer')).user;
        vm.isStudent = (userInfos.type === 'student');

        // Status
        vm.status = {
            "pending": "En attente de validation",
            "validated": "Terminée",
            "running": "En cours",
            "canceled": "Refusée par l'intervenant"
        }


        // Displayed Variables
        vm.claims = [];


        var init = function () {
            ensureClaimService()
                .then(ensureAuthorizationService)
                .then(ensureOfferService)
                .then(ensureGroupService)
                .then(ensureProjectService)
                .then(ensureFacilitatorService)
                .then(function () {
                    // récupération des groupes d'un utilisateur 
                    if (vm.isStudent) {
                        groupServiceInstance.getGroupsOfUser(userInfos.id).then(function (groups) {
                            groups.forEach(function (group) {
                                if (group.students.filter(function (stu) { return stu.id != userInfos.id }).length !== 0) {  // Que les groupes du student
                                    group.claims.forEach(function (claim) {
                                        //if (claim.status !== "canceled") {
                                        offerServiceInstance.getOffer(claim.offer_id).then(function (offer) {
                                            vm.claims.push({
                                                "claimId": claim.id,
                                                "offerId": offer.id,
                                                "offerName": offer.name,
                                                "projectName": group.project.name,
                                                "status": claim.status,
                                                "groupName": group.name,
                                                "intervenantName": offer.facilitator.first_name + " " + offer.facilitator.last_name,
                                                "facilitator": offer.facilitator,
                                                "offerDescription": offer.description
                                            });
                                            console.log(vm.claims);
                                        });
                                        //}
                                    })
                                    vm.isReady = true;
                                }
                            });
                        });
                    } else {
                        facilitatorServiceInstance.getFacilitatorById(userInfos.id).then(function (facilitator) {
                            facilitator.offers.forEach(function (offer) {
                                claimServiceInstance.getClaims(offer.id).then(function (data) {
                                    var promises = [];
                                    data.claims.forEach(function (claim) {
                                        promises.push(claimServiceInstance.getClaim(offer.id, claim.id));
                                    });
                                    $q.all(promises).then(function (data) {
                                        data.forEach(function (claim) {
                                            projectServiceInstance.getProjectAdmin(claim.group.project_id).then(function (project) {
                                                vm.claims.push({
                                                    "intervenantName": userInfos.first_name + " " + userInfos.last_name,
                                                    "claimId": claim.id,
                                                    "offerId": offer.id,
                                                    "offerName": offer.name,
                                                    "projectName": project.name,
                                                    "status": claim.status,
                                                    "groupName": claim.group.name,
                                                });
                                            });
                                        })
                                        vm.isReady = true;
                                        if (!$scope.$$phase) {

                                            $scope.$apply();
                                        }
                                    })
                                });
                            });

                        });
                    }
                }).catch(function (error) {
                    $log.error("Erreur", error);
                    $state.go('dashboard');
                });
        }

        init();

        ////// function controller
        vm.viewClaim = function (claimInfos) {
            $state.go('Claims.viewclaim', { claim: claimInfos });
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

        function ensureProjectService() {
            var deferredProjectService = $q.defer();

            if (!projectServiceInstance) {
                projectService.get().then(function (projectService) {
                    projectServiceInstance = projectService;
                    if (projectServiceInstance)
                        deferredProjectService.resolve(projectServiceInstance);
                    else {
                        deferredProjectService.reject();
                    }
                });
            } else {
                deferredProjectService.resolve(projectServiceInstance);
            }

            return deferredProjectService.promise;
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

        function ensureFacilitatorService() {
            var deferredFacilitatorService = $q.defer();

            // Obtient le service de gestion des autorisations
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

    }
})();