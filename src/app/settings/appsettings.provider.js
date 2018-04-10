"use strict";

(function (angular) {
    
    angular.module("appSettings")
        .provider("appSettings", appSettingsProvider);

    function appSettingsProvider() {

        // Initialise la configuration avec les valeurs par défaut
        var internalAppSettings = {
            applicationUrl: "",
            apiBaseUrl: ""
        };

        return {
            set: updateAppSettings,
            $get: function () {
                return internalAppSettings;
            }
        };

        function updateAppSettings(appSettings) {
            if (appSettings) {
                // Met à jour ou ajoute les paramètres
                for (var itemAppSettings in appSettings) {
                    internalAppSettings[itemAppSettings] = appSettings[itemAppSettings];
                }
            }
        }
    };
})(angular);





//"use strict";

//(function (angular) {
    
//    angular.module("appsettings")
//        .provider("appsettings", appsettingsConfigProvider);

//    function appsettingsConfigProvider() {

//        // Initialise la configuration avec les valeurs par défaut
//        var internalAppSettings = {
//            clientAppUrl: "",
//            apiBaseUrl: ""
//        };

//        return {
//            set: updateAppSettings,
//            $get: function () {
//                return internalAppSettings;
//            }
//        };

//        function updateAppSettings(appSettings) {
//            if (appSettings) {
//                // Met à jour ou ajoute les paramètres
//                for (var itemAppSettings in appSettings) {
//                    internalAppSettings[itemAppSettings] = appSettings[itemAppSettings];
//                }
//            }
//        }
//    };
//})(angular);