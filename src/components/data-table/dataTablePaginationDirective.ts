///
/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///    http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

///<reference path="../../tsd.d.ts"/>
export default class DataTablePagination implements ng.IDirective {
    public link: ($scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    public template = require<string>('./data-table-pagination.html');
    public scope = {
        resourceList: '=',
        currentPage: '=',
        linkHeader: '=',
        pageSetter: '&',
        perPage: '='
    };
    public replace = true;

    constructor() {
        this.link = ($scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            $scope.currentPageView = $scope.currentPage + 1;
            $scope.pagesNumber = getPagesNumber();

            function getPagesNumber() {
                return $scope.resourceList && Math.ceil(($scope.resourceList.length || 1) / $scope.perPage);
            }

            $scope.setPage = (pageNumber: number) => {
                $scope.pagesNumber = getPagesNumber();

                if ($scope.pagesNumber === 1) {
                    $scope.currentPageView = 1;
                    return;
                }

                if (pageNumber < 1) {
                    $scope.pageSetter({ pageNumber: 0 });
                    $scope.currentPageView = 1;
                } else if (pageNumber >= $scope.pagesNumber) {
                    $scope.pageSetter({ pageNumber: $scope.pagesNumber - 1 });
                    $scope.currentPageView = pageNumber;
                } else {
                    $scope.pageSetter({ pageNumber: pageNumber });
                }
            };

            $scope.goToFirst = () => {
                $scope.pageSetter({ pageNumber: 0 });
            };

            $scope.goToLast = () => {
                $scope.pagesNumber = getPagesNumber();
                $scope.pageSetter({ pageNumber: $scope.pagesNumber - 1 });
            };

            $scope.goTos = [0];

            $scope.$watch('currentPage', (recentCurrentPage) => {
                $scope.currentPageView = parseInt(recentCurrentPage, 10) + 1;
            });

            $scope.$watchGroup(['perPage'], () => {
                $scope.pagesNumber = getPagesNumber();
                $scope.goTos = new Array($scope.pagesNumber);
            });

        };
    }

    public static Factory = () => {
        let directive = () => new DataTablePagination();

        directive.$inject = [];

        return directive;
    };
}
