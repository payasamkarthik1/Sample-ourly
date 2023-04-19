

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
                null,
                request.project_id, 
                request.first_week_day, 
                request.last_week_day, 
                2,
                3,
                0
            );
        const queryString = util.getQueryString('project_wise_approval_withdraw', paramsArr);
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


    this.projectWiseTaskDetailsApproval = async function (request,data) {
        let responseData = [],
            error = true;
            const paramsArr = new Array(
                request.employee_id,
                request.lead_employee_id,
                request.project_id, 
                request.first_week_day, 
                request.last_week_day, 
                4,
                1,
                1
            );
        const queryString = util.getQueryString('project_wise_approval_withdraw', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = "Approved successfully";
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
             return [error, responseData];
        }
    }

    this.getProjectLeadWiseEntries = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            request.role_id || 0
        );

        const queryString = util.getQueryString('get_assigned_lead_projects', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    for (let i of data) {
                        const paramsArr1 = new Array(
                            request.employee_id,
                            request.first_week_day,
                            request.last_week_day,
                            i.project_id,
                            request.role_id || 0
                        );
                       let [err, response] = await this.getProjectLeadWisedata(paramsArr1,i)
                       responseData.push(response);
                    }
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData.flat()];
        }

    }

    
    this.getProjectLeadWisedata = async function (paramsArr,data) {
        let responseData = [],
            error = true;

        const queryString = util.getQueryString('get_project_lead_wise_entries', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, paramsArr)
                .then(async (res) => {

                    for (let i of res) {
                        i.project_lead_name = data.first_name;
                        if (i.status_id == 5) {
                            i.status_id = 2
                        } else if (i.status_id == 4) {
                            i.status_id = 3
                        }
                    }

                    responseData.push({
                        "project_id": data.project_id,
                        "project_name": data.project_name,
                        "data": res
                    });
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })

            return [error, responseData];
        }

    }


    this.getEmployeeWiseProjectsData = async function (request,data) {
        let responseData = [],
            error = true;
            const paramsArr = new Array(
                request.employee_id, 
                request.project_id,
                request.first_week_day, 
                request.last_week_day
            );
        const queryString = util.getQueryString('get_employee_wise_projects_data', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                   
                    let dayWiseData = await this.dayWiseTotalTime(request, data);

                  tym = await util.sumOfTime(dayWiseData)
                 
                    responseData.push({
                        "project_name": dayWiseData[0]?.project_name,
                        "total_name": tym,
                        "values": dayWiseData
                    });
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
             return [error, responseData];
        }
    }


    this.dayWiseTotalTime = async function (request, data) {
        let tt = []
        var newArray = data.reduce(function (acc, curr) {
            //finding Index in the array where the NamaCategory matched
            var findIfNameExist = acc.findIndex(function (item) {
                return item.task_created_datetime === curr.task_created_datetime;
            })
            if (findIfNameExist === -1) {

                let obj = {
                    'task_created_datetime': curr.task_created_datetime,
                    "value": [curr]
                }
                acc.push(obj)
            } else {
                acc[findIfNameExist].value.push(curr)
            }

            return acc;

        }, []);

        for (let i = 0; i < newArray.length; i++) {
            toaltime = newArray[i].value
            data = newArray[i].value[0]
            f = await util.sumOfTime(toaltime)
            tt.push({
                task_created_datetime: newArray[i].task_created_datetime, task_total_time: f, "project_name": data.project_name,
                "project_color_code": data.project_color_code,
                "project_code": data.project_code,
                "tag_id": data.tag_id,
                "tag_name": data.tag_name,
                "task_created_datetime": data.task_created_datetime
            })
        }
        return tt

    }

    this.getAllTasksWeeklyByProjectList = async function (request,data) {
        let responseData = [],
            error = true;
            const paramsArr = new Array(
                request.employee_id, 
                request.project_id,
                request.first_week_day, 
                request.last_week_day
            );
        const queryString = util.getQueryString('get_all_tasks_weekly_by_project_list', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                   startDate = util.getMonthName(data[0].first_week_day)
                    endDate = util.getMonthName(data[0].last_week_day)
                    let dayWiseData = await this.dayWiseTotalTime(request, data);
                    tym = await util.sumOfTime(dayWiseData)

                    let status="";
                    if(data[0].status_id = 1){
                        status="PENDING"
                    }else if(data[0].status_id = 4){
                        status="APPROVED"
                    }else if(data[0].status_id = 5){
                        status="UNSUBMITTED"
                    }

                    let header = [];
                    for (let i of dayWiseData) {
                        header.push({
                            "header": {
                                "month": util.getMonthName(i.task_created_datetime),
                                "day": util.getDayName(i.task_created_datetime),
                                "hours": i.task_total_time
                            },
                            "child": data.filter((j) => j.task_created_datetime == i.task_created_datetime)
                        })
                    }
                    responseData.push([{
                        "isApp": {
                            "startDate": startDate,
                            "endDate": endDate,
                            "weekHour": tym,
                            "status": status,
                            // "submited_by": "mahesh vvvv test(Tue, Apr 18th)"
                        },
                        "head": header
                    }])
                    
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
