(function () {
    'use strict';

    angular.module('services', [])
        .factory('AlertService', function() {
            var alert;
            var alertService = {};

            alertService.add = function(item) {
                alert = item;
            };

            alertService.get = function() {
                var temp = alert;
                alert = undefined;
                return temp;
            };

            return alertService;
        })
    ;

})();
