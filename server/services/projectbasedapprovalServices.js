

function projectbasedapproval(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;

    this.getProjectWiseTaskDetails = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            request.employee_id
        );
        const queryString = util.getQueryString('get_project_wise_task_details', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                   for(let details of responseData){
                       this.insertProjectWiseTaskDetailsOnSubmit(request,details)
                   }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

    this.insertProjectWiseTaskDetailsOnSubmit = async function (request,data) {
        let responseData = [],
            error = true;
            flag = 1
            const paramsArr = new Array(
                request.employee_id, 
                request.first_week_day, 
                request.last_week_day, 
                data.week_name, 
                data.project_id, 
                data.total_hours,
                data.project_lead_employee_id, 
                data.lead_assigned_employee_id,
                util.getCurrentUTCTime(), 
                null,
                null,
                null,
                null,
                null,
                null,
                flag,
                1,
                1
            );
        const queryString = util.getQueryString('project_wise_approve_reject_submit_withdrawn_entries_insert', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            // return [error, responseData];
        }

    }

    this.projectWiseTaskDetailsWithdraw = async function (request,data) {
        let responseData = [],
            error = true;
            const paramsArr = new Array(
                request.employee_id, 
                request.first_week_day, 
                request.last_week_day, 
                2,
                3
            );
        const queryString = util.getQueryString('project_wise_withdraw', paramsArr);
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


module.exports = projectbasedapproval;
