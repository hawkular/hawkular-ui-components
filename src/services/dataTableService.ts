///<reference path="../tsd.d.ts"/>
export interface IRowsColsResponse {
    rows: any[];
    cols: any[];
}

export default class DataTableService {
    /*@ngInject*/
    constructor (private $http: any) {}

    public retrieveRowsAndColumnsFromUrl(url): ng.IPromise<IRowsColsResponse> {
        return this.$http({
            method: 'GET',
            url: location.origin + url
        }).then((responseData) => {
            return {
                rows: responseData.data.rows,
                cols: responseData.data.head
            };
        });
    }
}
