(function () {
    'use strict';

    angular.module('filters', [])
        .filter('highlight', function () {
            /**
             * Highlight search words
             * from Angular-UI
             */
            function escapeRegexp(queryToEscape) {
                return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            }

            return function (matchItem, query, type) {
                return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight bg-' + type + '">$&</span>') : matchItem;
            };
        })

        .filter('keywordsFilter', function () {
            return function (items, criterion) {
                return items.filter(function (element, index, array) {
                    var str = String(element.phrase);
                    if (str.indexOf(criterion) + 1) {
                        return true;
                    } else {
                        element.visible = false;
                    }
                });
            }
        })
    ;

})();
