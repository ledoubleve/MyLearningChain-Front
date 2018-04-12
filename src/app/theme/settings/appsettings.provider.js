"use strict";

(function (angular) {
    
    angular.module("appSettings")
        .provider("appSettings", appSettingsProvider);

    function appSettingsProvider() {

        // Initialise la configuration avec les valeurs par défaut
        var internalAppSettings = {
            applicationUrl: "",
            apiBaseApiUrl: "",
            apiBaseAdminUrl: "",
            apiBasePubUrl: "",
            socketUrl: "",
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