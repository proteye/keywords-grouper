(function () {
    'use strict';

    angular.module('directives', [])
        .directive('alertMessage', function ($compile, $timeout) {
            return {
                restrict: 'A',
                scope: {alertMessage: '=', alertType: '=', alertShow: '='},
                link: function (scope, element, attrs) {
                    var template = '<div class="alert alert-{{alertType}} alert-dismissible fade in" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '<strong>{{alertMessage}}</strong>' +
                        '</div>'
                    ;
                    scope.$watch('alertShow', function (value) {
                        if (value == true) {
                            var content = $compile(template)(scope);
                            element.append(content);
                            $timeout(function () {
                                element.find('.alert').alert('close');
                            }, 3000);
                        }
                    });
                }
            };
        })

        .directive('filterEnter', function () {
            return  {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind("keypress", function (event) {
                        if (event.which === 13) {
                            if (attrs.filterEnter == 1) {
                                scope.keywordCtrl.filterModel1 = scope.keywordCtrl.filterInput1.toString();
                            } else if (attrs.filterEnter == 2) {
                                scope.keywordCtrl.filterModel2 = scope.keywordCtrl.filterInput2.toString();
                            } else if (attrs.filterEnter == 3) {
                                scope.keywordCtrl.filterModel3 = scope.keywordCtrl.filterInput3.toString();
                            } else if (attrs.filterEnter == 4) {
                                scope.keywordCtrl.filterModel4 = scope.keywordCtrl.filterInput4.toString();
                            }
                            scope.keywordCtrl.inputShow2 = !!scope.keywordCtrl.filterModel1 || !!scope.keywordCtrl.filterModel2 || !!scope.keywordCtrl.filterModel3 || !!scope.keywordCtrl.filterModel4;
                            scope.keywordCtrl.inputShow3 = !!scope.keywordCtrl.filterModel2 || !!scope.keywordCtrl.filterModel3 || !!scope.keywordCtrl.filterModel4;
                            scope.keywordCtrl.inputShow4 = !!scope.keywordCtrl.filterModel3 || !!scope.keywordCtrl.filterModel4;

                            scope.$apply();
                        }
                    });
                }
            };
        })

        .directive('treeview', function () {
            /**
             * Thanks for: http://habrahabr.ru/sandbox/75566/
             */
            return {
                restrict: 'A',
                priority: 1001,
                controller: 'GroupController',
                compile: function (element, tAttrs) {
                    angular.forEach(angular.element(element.find('li')), function (item) {
                        var el = angular.element(item);

                        el.prepend($('<i />').addClass('normal').attr('ng-hide', 'config.hasItems'));
                        el.prepend($('<i />').addClass('expanded').attr('ng-show', 'config.hasItems && !config.collapsed').attr('ng-click', 'collapse(config)'));
                        el.prepend($('<i />').addClass('collapsed').attr('ng-show', 'config.hasItems && config.collapsed').attr('ng-click', 'collapse(config)'));
                    });

                    var itemTemplate = element.html();
                    var template = $('<ul ng-hide="config.collapsed" />').append(itemTemplate)[0].outerHTML;

                    return function (scope, element, attrs, ctrl) {
                        ctrl.Template = template;
                        element.addClass('treeview');
                        scope.collapse = function (config) {
                            config.collapsed = !config.collapsed;
                        }

                    }
                }
            }
        })

        .directive('treeviewChilds', ['$compile', '$parse', function ($compile, $parse) {
            return {
                restrict: 'A',
                require: '^treeview',
                link: function (scope, element, attrs, ctrl) {
                    var items = $parse(attrs.treeviewChilds)(scope);
                    var newScope = scope.$new();
                    newScope.groups = items;

                    scope.config = {};
                    if (items != null && items.length > 0) {
                        newScope.$parent.config.hasItems = true;
                        newScope.$parent.config.collapsed = true;
                        element.append($compile(ctrl.Template)(newScope));
                    }
                    else {
                        newScope.$parent.config.hasItems = false;
                        newScope.$parent.config.collapsed = false;
                    }
                }
            }
        }])
    ;

})();
