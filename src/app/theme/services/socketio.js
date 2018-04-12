(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('socketio', socketio);

    /** @ngInject */
    function socketio($log, $rootScope, appSettings) {
       
        return {
            client: (function () {
                var client = io.connect(appSettings.socketUrl);
                client.emit("register", { token: sessionStorage.getItem('bearer') });
                return client;
            })(),
            on: function (eventName, callback) {
                if (socket) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                }
            },
            emit: function (eventName, data, callback) {
                if (socket) {
                    socket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    });
                }
            }
        };
    }

})();