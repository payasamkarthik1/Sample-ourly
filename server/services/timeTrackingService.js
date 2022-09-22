
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

function TimeTrackingService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)



    this.timetrackingTaskDetailsInsert = async function (request) {


        let responseData = [],
            error = true;
        const paramsArr = new Array(
            util.getRandomNumericId(),
            request.task_description,
            request.project_id,
            request.tag_id,
            request.employee_id,
            request.task_start_time,
            request.task_end_time,
            await util.getTimeDiff(request),
            request.task_created_datetime,
            util.getCurrentUTCTime()
        );


        const queryString = util.getQueryString('timetracking_add_task_detail_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.timetrackingTaskDetailsGetAllList = async function (request) {


        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );


        const queryString = util.getQueryString('timetracking_get_all_task_details_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };
    this.timetrackingTaskDetailsGetByEmployeeId = async function (request) {


        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = util.getQueryString('timetracking_get_task_details_By_employeeid_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };


}



module.exports = TimeTrackingService;
