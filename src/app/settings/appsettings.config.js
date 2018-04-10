"use strict";

(function (angular) {
    // Configure le module des paramètres de l'application de gestion des identités HQA
    angular.module("appSettings")
        .config(appSettingsConfig);

    appSettingsConfig.$inject = ["appSettingsProvider"];

    function appSettingsConfig(appSettingsProvider) {
        var initInjector = angular.injector(['ng']);
        var $http = initInjector.get('$http');
        // Lit les paramètres dans l'élément JSON

        var appSettingsScript;

        $http.get("appsettings.json")
            .success(function(response) {
                appSettingsScript = response;
            })
            .then(function() {
                // Définit les paramètres de l'application
                if (appSettingsScript) {
                    appSettingsProvider.set(appSettingsScript);
                } else {
                    var $log = angular.injector(["ng"]).get("$log");
                    $log.error("Erreur lors de la lecture de la configuration de l'application");
                }
            });

        
    };
})(angular);

//"use strict";

//(function (angular) {
//    angular.module("appsettings")
//        .config(appsettingsConfig);

//    appsettingsConfig.$inject = ["appsettingsConfigProvider"];

//    function appsettingsConfig(appsettingsConfigProvider) {

//        //var appSettingsScript;

//        //$http.get("appsettings.json")
//        //    .success(function(response) {
//        //        appSettingsScript = response;
//        //    });

//        //// Définit les paramètres de l'application
//        //if (appSettingsScript) {
//        //    appsettingsConfigProvider.set(JSON.parse(appSettingsScript));
//        //} else {
//        //    var $log = angular.injector(["ng"]).get("$log");
//        //    $log.warn("Erreur lors de la lecture de la configuration de l'application.");
//        //}
//    };
//})(angular);