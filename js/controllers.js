(function () {
    'use strict';

    angular.module('controllers', [])
        .controller('MainController', ['$http', function ($http) {
            var self = this;
            this.project = {
                keywords: [],
                allocated: [],
                blacklist: [],
                categories: [],
                groups: []
            };
            this.projectName = '';
            this.freqShow = false;
            this.competitionShow = false;
            this.project.keywords = keywords;
            this.alert = {message: undefined, type: undefined, show: false};
        }])

        .controller('TabController', function () {
            var self = this;
            this.tab = 1;
            this.setTab = function (newValue) {
                self.tab = newValue;
            };
            this.isSet = function (selectedTab) {
                return self.tab === selectedTab;
            };
        })

        .controller('KeywordController', ['$scope', '$http', '$timeout', 'Upload', function (
            $scope, $http, $timeout, Upload
        ) {
            var self = this;
            this.filterModel1 = ''; this.filterModel2 = ''; this.filterModel3 = ''; this.filterModel4 = '';
            this.filterInput1 = ''; this.filterInput2 = ''; this.filterInput3 = ''; this.filterInput4 = '';
            this.inputShow2 = false; this.inputShow3 = false; this.inputShow4 = false;
            this.checkAll = false;

            this.checkItem = function (item) {
                item.checked = !item.checked;
            };

            this.checkItems = function (keywords) {
                self.checkAll = !self.checkAll;
                angular.forEach(keywords, function (key) {
                    if (key.visible) {
                        key.checked = self.checkAll;
                    }
                });
            };

            this.createGroup = function () {
                var tempGroup = [];
                var tempKeys = [];
                var tempKeywords = _.filter($scope.main.project.keywords, function (key) {
                    var checked = key.checked;
                    if (checked) {
                        var _key = {id: key.id};
                        _key.phrase = key.phrase;
                        if (key.freq !== undefined) {
                            _key.freq = key.freq;
                        }
                        if (key.competition !== undefined) {
                            _key.competition = key.competition;
                        }
                        _key.items = null;
                        tempKeys.push(_key);
                        key.checked = false;
                        $scope.main.project.allocated.push(key);

                    }
                    return !checked;
                });
                $scope.main.project.keywords = tempKeywords;
                self.checkAll = false;
                if (tempKeys[0] !== undefined) {
                    tempGroup = {phrase: tempKeys[0].phrase, items: tempKeys};
                    $scope.main.project.groups.push(tempGroup);
                }
            };

            this.toBlacklist = function () {
                var tempKeys = [];
                var tempKeywords = _.filter($scope.main.project.keywords, function (key) {
                    var checked = key.checked;
                    if (checked) {
                        key.checked = false;
                        $scope.main.project.blacklist.push(key);
                    }
                    return !checked;
                });
                $scope.main.project.keywords = tempKeywords;
                self.checkAll = false;
            };

            this.uploadKeywords = function(file, errFiles) {
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[0];
                if (file) {
                    file.upload = Upload.upload({
                        url: '/backend/upload.php',
                        data: {file: file, type: 'keywords'}
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                        });
                        $scope.main.alert = {message: undefined, type: undefined, show: false};
                        $http.get('json/' + response.data)
                            .success(function (data) {
                                $scope.main.project.keywords = data;
                                $scope.main.freqShow = false;
                                $scope.main.competitionShow = false;
                                if (data[0].freq !== undefined) {
                                    $scope.main.freqShow = true;
                                }
                                if (data[0].competition !== undefined) {
                                    $scope.main.competitionShow = true;
                                }
                                $scope.main.alert = {message: 'Ключи успешно загружены', type: 'success', show: true};
                            })
                        ;
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 *
                            evt.loaded / evt.total));
                    });
                }
            };

            this.uploadProject = function(file, errFiles) {
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[0];
                if (file) {
                    file.upload = Upload.upload({
                        url: '/backend/upload.php',
                        data: {file: file, type: 'project'}
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                        });
                        $scope.main.alert = {message: undefined, type: undefined, show: false};
                        $http.get('projects/' + response.data)
                            .success(function (data) {
                                var filename = response.data;
                                $scope.main.project = data;
                                $scope.main.projectName = filename.substr(0, filename.length - 5);
                                $scope.main.alert = {message: 'Проект успешно загружен', type: 'success', show: true};
                            })
                        ;
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 *
                            evt.loaded / evt.total));
                    });
                }
            };
        }])

        .controller('GroupController', ['$scope', '$http', '$location', 'AlertService', function ($scope, $http, $location, AlertService) {
            var self = this;

            $scope.$watch('main.project.groups', function (newValue, oldValue) {
                $scope.groups = newValue;
            });

            this.addToGroup = function (group) {
                var tempKeywords = _.filter($scope.main.project.keywords, function (key) {
                    var checked = key.checked;
                    if (checked) {
                        var _key = {phrase: key.phrase};
                        if (key.freq !== undefined) {
                            _key.freq = key.freq;
                        }
                        if (key.competition !== undefined) {
                            _key.competition = key.competition;
                        }
                        _key.items = null;
                        group.items.push(key);
                        key.checked = false;
                        $scope.main.project.allocated.push(key);

                    }
                    return !checked;
                });
                $scope.main.project.keywords = tempKeywords;
                self.checkAll = false;
            };

            this.removeGroup = function (groups, index) {
                _.each(groups[index].items, function (elm1, index1) {
                    _.each($scope.main.project.allocated, function (elm2, index2) {
                        if (_.isEqual(elm1.id, elm2.id)) {
                            $scope.main.project.keywords.push(elm2);
                            $scope.main.project.allocated.splice(index2, 1);
                        }
                    });
                });
                groups.splice(index, 1);
            };

            this.saveProject = function (project) {
                $scope.main.alert = {message: undefined, type: undefined, show: false};
                $http({method: 'post', url: '/backend/save_project.php', data: {name: $scope.main.projectName, project: project}})
                    .success(function (data) {
                        $scope.main.alert = {message: 'Проект успешно сохранен', type: 'success', show: true};
                    })
                    .error(function (data) {
                        $scope.main.alert = {message: 'Во время сохранения произошла ошибка', type: 'danger', show: true};
                    })
                ;
            };

            this.exportProject = function (project) {
                $scope.main.alert = {message: undefined, type: undefined, show: false};
                $http({method: 'post', url: '/backend/save_project.php', data: {name: $scope.main.projectName, project: project}})
                    .success(function (data) {
                        $scope.main.alert = {message: 'Проект успешно сохранен', type: 'success', show: true};
                        $http({method: 'post', url: '/backend/export_project.php', data: {name: $scope.main.projectName}})
                            .success(function (data) {
                                window.location.href = '/projects/' + data;
                            })
                            .error(function (data) {
                                $scope.main.alert = {message: 'Во время экспорта произошла ошибка', type: 'danger', show: true};
                            })
                        ;
                    })
                    .error(function (data) {
                        $scope.main.alert = {message: 'Во время сохранения произошла ошибка', type: 'danger', show: true};
                    })
                ;
            };

        }])
    ;

    var keywords = [
        {
            "id":0,
            "phrase":"ключевые слова",
            "freq":37406
        },
        {
            "id":1,
            "phrase":"статистики ключевых слов",
            "freq":28651
        },
        {
            "id":2,
            "phrase":"подобрать ключевые слова",
            "freq":13453
        },
        {
            "id":3,
            "phrase":"статистика запросов",
            "freq":11983
        },
        {
            "id":4,
            "phrase":"количество слов",
            "freq":9048
        },
        {
            "id":5,
            "phrase":"источники ключевых слов",
            "freq":8474
        },
        {
            "id":6,
            "phrase":"группировщик слов",
            "freq":7595
        },
        {
            "id":7,
            "phrase":"русский толковый словарь",
            "freq":6961
        },
        {
            "id":8,
            "phrase":"фонетический разбор онлайн",
            "freq":6588
        },
        {
            "id":9,
            "phrase":"морфологический разбор слова",
            "freq":6372
        }
    ];

})();
