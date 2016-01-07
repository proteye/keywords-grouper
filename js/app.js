(function () {
    'use strict';

    angular.module('keyGrouper', [
        'ngSanitize', 'ngFileUpload',
        'controllers', 'directives', 'filters', 'services'
    ])
        .value('appName', 'Keywords Grouper')

        .value('version', '0.1.1')
    ;

})();
