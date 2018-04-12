(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('chatService', chatService);

    /** @ngInject */
    function chatService($q, $log, appSettings) {

        var baseApiForChat = `${appSettings.apiBasePubUrl}/offers/{interventionId}/claims/{claimId}`

        // claim id
        var clId;
        // presta Id
        var interId;

        /*
         * Send Messasge to api
         * Example :
         * {
         *  Sender:
         *  Message:
         *  Date: 
         * }
         *
         *
         *
         * @param {any} message
         */
        var sendMessage = function(message) {
            $log.debug("Message : ", message);
            var data = {
                "content": message
            };

            var config = {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('bearer')}`
                }
            }
        
            return axios.post(baseApiForChat.replace("{interventionId}", interId).replace("{claimId}", clId) + '/messages', data, config)
            .then(function (response) {
                // Socket 
                $log.debug(`Success posting new message : ${JSON.stringify(message)}`);
                return $q.resolve(response.data);
            }).catch(function (error) {
                $log.error(`Error on posting new message : ${JSON.stringify(message)} | Error : ${error}`);
                return $q.reject("error");
            });
        }

        // get messages from an assistance
        var getMessageFromAssistance = function (interventionId, claimId) {

            interId = interventionId;
            clId = claimId;
            
            var config = {
                headers: { 'Authorization': "Bearer " + window.sessionStorage.getItem("bearer"), 'Access-Control-Allow-Origin': '*' }
            }

            return axios.get(baseApiForChat.replace("{interventionId}", interventionId).replace("{claimId}", claimId) + "/messages", config).then(function (response) {
                console.log("response from message api", response);
                if (response.data) {
                    return $q.resolve(responseParser(response.data.messages));
                } else {
                    return $q.reject("Erreur lors de la récupération des messages");
                }
            });
        }

        var responseParser = function (messages) {
            var result = [];
            messages.forEach(function (message) {
                result.push({
                    id: message.id,
                    text: message.content,
                    date: message.created_at,
                    userName: message.user.first_name + " " + message.user.last_name,
                    userId: message.user.id
                });
            });
            return result
        }


        return {
            getMessageByAssistanceId: getMessageFromAssistance,
            sendMessage: sendMessage
        }
    }

})();