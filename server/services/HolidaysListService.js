

function HolidaysListService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;



    this.addHolidaysList = async function (request) {
        let responseData = [],
            error = true;
        await this.removeHolidayListDelete(request);
        data1 = request.data
        for (let i = 0; i < Object.keys(data1[0]).length; i++) {
            const [err, respData] = await this.addHolidaysListInsert(data1[0][i], request)
            error = err
            responseData = respData
        }
        return [error, responseData];

    }

    this.addHolidaysListInsert = async function (data, request) {
        console.log('==========sss===========');
        console.log(data);
        console.log('====================================');

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            data.holidays,
            await util.dateConvertInExcel(data.date),
        );

        const queryString = util.getQueryString('holidays_list_add_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.getHolidayslistSelect = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('holidays_get_list_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    const data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    console.log('====================================');
                    console.log(data1);
                    console.log('=========================oooe=====');
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.removeHolidayListDelete = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );
        const queryString = util.getQueryString('holidays_list_remove_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }


}


module.exports = HolidaysListService;
