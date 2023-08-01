const { request, response } = require('express');
const EmployeeService = require('./employeeService')
const TimeTrackingService = require('./timeTrackingService')
function projectbasedapproval(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const employeeService = new EmployeeService(objectCollection)
    const timeTrackingService = new EmployeeService(TimeTrackingService)

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
                    for (let details of responseData) {
                        this.insertProjectWiseTaskDetailsOnSubmit(request, details)
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

    this.insertProjectWiseTaskDetailsOnSubmit = async function (request, data) {
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

    this.projectWiseTaskDetailsWithdraw = async function (request, data) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            null,
            request.project_id,
            request.first_week_day,
            request.last_week_day,
            null,
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


    this.projectWiseTaskDetailsApproval = async function (request, data) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.lead_employee_id,
            request.project_id,
            request.first_week_day,
            request.last_week_day,
            null,
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


    this.projectWiseTaskDetailsReject = async function (request, data) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.lead_employee_id,
            request.project_id,
            request.first_week_day,
            request.last_week_day,
            request.rejected_note,
            5,
            1,
            2
        );
        const queryString = util.getQueryString('project_wise_approval_withdraw', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    const [err1, data1] = await this.onRejectSendMail(request)
                    responseData = data1;
                    error = err1
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.onRejectSendMail = async function (request) {
        let responseData = [],
            error = true;

        request.rejected_datetime = await util.getCurrentUTCTime()
        const [err1, data1] = await employeeService.getEmployeeById(request)
        request.employee_email = data1[0].email,
            request.employee_name = data1[0].full_name

        request.employee_id = request.lead_employee_id
        const [err2, data2] = await employeeService.getEmployeeById(request)
        request.rejected_by = data2[0].full_name

        const [err3, data3] = await this.getProjectByProjectId(request)
        request.project_name = data3[0].project_name
        request.task_created_datetime = request.first_week_day;
        request.week_name = await util.getWeekName(request),

            await util.nodemailerSenderOnReject(request).then((data) => {
                error = false
                responseData = [{ message: "rejected successfully and mail have been sended to employee" }]
            }).catch((err) => {
                console.log("err-------" + err);
                error = err
            })
        return [error, responseData];

    }

    this.getProjectByProjectId = async function (request) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            request.project_id.toString(),
        );

        const queryString = util.getQueryString('get_project_by_project_id', paramsArr);

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

    //getProjectLeadWiseEntries
    this.getProjectLeadWiseEntries = async function (request) {
        let responseData = [],
            error = true;
        console.log("=================getProjectLeadWiseEntries=========================")
        const startDate = request.first_week_day;
        const endDate = request.last_week_day;
        const dates = await util.getWeekStartAndEndDates(startDate, endDate);
        const paramsArr = new Array(
            request.employee_id,
            //request.first_week_day,
            //request.last_week_day,
            request.role_id || 0
        );

        const queryString = util.getQueryString('get_assigned_lead_projects', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    for (let i of data) {
                        for (let j = dates.length-1; j >=0 ; j--) {
                            const paramsArr1 = new Array(
                                request.employee_id,
                                request.first_week_day = dates[j][0],
                                request.last_week_day = dates[j][1],
                                i.project_id,
                                request.role_id || 0
                            );
                            let [err, response] = await this.getProjectLeadWisedata(paramsArr1, i);
                            responseData.push(response);
                        }
                    }
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                });
            let result = {};
            let emptyArry;
            let groupResponseData = responseData.flat().map(obj => {
                const { project_id, project_name, ...rest } = obj;

                if (!result[project_id]) {
                    emptyArry = [{ project_id, project_name, data: [] }];
                    emptyArry[0].project_id = (project_id);
                    emptyArry[0].project_name = project_name;
                }
                if (rest.data.length != 0) {
                    emptyArry[0].data.push(rest.data.flat());
                }
                return emptyArry[0];
            });
            let filterResponseData = Object.values(groupResponseData.reduce((acc, { project_id, project_name, data }) => {
                if (!acc[project_id]) {
                    acc[project_id] = { project_id, project_name, data: [] };
                }
                acc[project_id].data = acc[project_id].data.concat(data);
                return acc;
            }, {}));
            filterResponseData=filterResponseData.sort((a, b) => a.project_name.localeCompare(b.project_name))
            for (let i = 0; i < filterResponseData.length; i++) {
                filterResponseData[i].data = filterResponseData[i].data.flat();
            }
            return [error, filterResponseData];
        }

    }
    
    //getProjectLeadWisedata
    this.getProjectLeadWisedata = async function (paramsArr, data) {
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

    
    //get/project/lead/wise/data/check/status 
    this.getProjectLeadWiseDataToCheckStatuses = async function (request) {
        let responseData = [],
            error = true;
        console.log("==========================get/project/lead/wise/week/data=====================")
        const startDate = request.first_week_day;
        const endDate = request.last_week_day;
        const dates = await util.getWeekStartAndEndDates(startDate, endDate);
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('get_all_projects', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    for (let i of data) {

                        for (let j = dates.length - 1; j >= 0; j--) {
                            const paramsArr1 = new Array(
                                request.first_week_day = dates[j][0],
                                request.last_week_day = dates[j][1],
                                i.project_id,
                            );
                            let [err, response] = await this.getProjectLeadWiseWeekData(paramsArr1, i);
                            responseData.push(response);
                        }
                    }
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                });
            let result = {};
            let emptyArry;
            let groupResponseData = responseData.flat().map(obj => {
                const { project_id, project_name, project_lead_name, ...rest } = obj;
                if (!result[project_id]) {
                    emptyArry = [{ project_id, project_name, project_lead_name, data: [] }];
                    emptyArry[0].project_id = (project_id);
                    emptyArry[0].project_name = project_name;
                    emptyArry[0].project_lead_name = project_lead_name;
                }
                if (rest.data.length != 0) {
                    emptyArry[0].data.push(rest.data);
                }
                return emptyArry[0];
            });

            let filterResponseData = Object.values(groupResponseData.reduce((acc, { project_id, project_name, project_lead_name, data }) => {
                if (!acc[project_id]) {
                    acc[project_id] = { project_id, project_name, project_lead_name, data: [] };
                }
                acc[project_id].data = acc[project_id].data.concat(data);
                return acc;
            }, {}));

            filterResponseData = filterResponseData.sort((a, b) => a.project_name.localeCompare(b.project_name));
            for (let i = 0; i < filterResponseData.length; i++) {
                filterResponseData[i].data = filterResponseData[i].data.flat();
            }
            return [error, filterResponseData];
        }

    }

    //get project/lead/wise/week/data
    this.getProjectLeadWiseWeekData = async function (paramsArr, data) {
        let responseData = [],
            error = true;
        const queryString = util.getQueryString('get_project_lead_wise_data', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, paramsArr)
                .then(async (res) => {
                    //check the project_have team_lead or not if not project_team_lead='Team_lead' 
                    if (data.project_lead_employee_id === 0) {
                        data.project_lead_name = 'Team_lead'
                    } else {
                        data.project_lead_name = data.first_name;
                    }
                    for (let i of res) {
                        //res.first_name=i.first_name;    
                        if (i.status_id == 5) {
                            i.status_id = 2
                        } else if (i.status_id == 4) {
                            i.status_id = 3
                        }
                    }
                    responseData.push({
                        "project_id": data.project_id,
                        "project_name": data.project_name,
                        "project_lead_name": data.project_lead_name,
                        "data": res
                    });
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })

            return [error, responseData];
        }

    }

    this.getEmployeeWiseProjectsData = async function (request, data) {
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

    this.getAllTasksWeeklyByProjectList = async function (request, data) {
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
                    if (data.length) {
                        startDate = util.getMonthName(data[0].first_week_day)
                        endDate = util.getMonthName(data[0].last_week_day)
                        let dayWiseData = await this.dayWiseTotalTime(request, data);
                        tym = await util.sumOfTime(dayWiseData)

                        let statusID = data[0].status_id;
                        let status = "";
                        if (statusID == 1) {
                            status = "PENDING"
                        } else if (statusID == 4) {
                            status = "APPROVED"
                        } else if (statusID == 5 || statusID == 2) {
                            status = "UNSUBMITTED"
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

                        let isApp = {
                            "startDate": startDate,
                            "endDate": endDate,
                            "weekHour": tym,
                            "status": status
                        }

                        let submitedBy = `${data[0].submitted_by}(${data[0].submited_for_approval_datetime})`;
                        let approvedBy = `${data[0].approved_by}(${data[0].approved_on_datetime})`;

                        if (data[0].submitted_by != "" && data[0].submitted_by != undefined) {
                            isApp.submited_by = submitedBy
                        }

                        if (data[0].approved_by != "" && data[0].approved_by != undefined) {
                            isApp.approved_by = approvedBy
                        }
                        responseData.push([{
                            "isApp": isApp,
                            "head": header
                        }])
                    }
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.getProjectLeads = async function (request, data) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );
        const queryString = util.getQueryString('get_project_leads', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    //get/un-submitted/time-tracking/employee/data
    this.getUnSubmittedTimetrackingEmployeeData = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day
        );
        const queryString = await util.getQueryString('employee_get_all_active_employee', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    //get/project/lead/wise/data/check/status 
    this.getProjectLeadWiseDataToCheckStatusesUPDATEDCODEFORTIMEREDUCTION = async function (request) {
        let responseData = [],
            error = true;
        console.log("==========================get/project/lead/wise/week/data=====================")
        const startDate = request.first_week_day;
        const endDate = request.last_week_day;
        const dates = await util.getWeekStartAndEndDates(startDate, endDate);
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('get_all_projects', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    for (let i of data) {

                        for (let j = dates.length - 1; j >= 0; j--) {
                            const paramsArr1 = new Array(
                                request.first_week_day = dates[j][0],
                                request.last_week_day = dates[j][1],
                                i.project_id,
                            );
                            let [err, response] = await this.getProjectLeadWiseWeekData(paramsArr1, i);
                            responseData.push(response);
                        }
                    }
                    let result = [];
                    const groupedData = {};
                    responseData.flat().forEach((item) => {

                        const { project_id, project_name, project_lead_name, ...rest } = item;

                        if (!groupedData[item.project_id]) {
                            groupedData[item.project_id] = {
                                project_id: item.project_id,
                                project_name: item.project_name,
                                project_lead_name: item.project_lead_name,
                                data: []
                            };
                        }
                        if (rest.data.length !== 0) {
                            groupedData[item.project_id].data.push(rest.data);
                        }

                    });//console.log("responseData====================================",groupedData)
                    for (const key in groupedData) {
                        if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
                            //console.log('groupedData=======================',g)
                            groupedData[key].data = groupedData[key].data.flat()
                            result.push(groupedData[key]);
                        }
                    }//console.log("result=============================",result);
                    result = result.sort((a, b) => a.project_name.localeCompare(b.project_name));

                    // for (let i = 0; i < result.length; i++) {
                    //     result[i].data = result[i].data.flat();
                    // }
                    error = false
                    responseData = result;
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                });
            // let result = {};
            // let emptyArry;
            // let groupResponseData = responseData.flat().map(obj => {
            //     const { project_id, project_name, project_lead_name, ...rest } = obj;
            //     if (!result[project_id]) {
            //         emptyArry = [{ project_id, project_name, project_lead_name, data: [] }];
            //         emptyArry[0].project_id = (project_id);
            //         emptyArry[0].project_name = project_name;
            //         emptyArry[0].project_lead_name = project_lead_name;
            //     }
            //     if (rest.data.length != 0) {
            //         emptyArry[0].data.push(rest.data);
            //     }
            //     return emptyArry[0];
            // });
            //console.log("responsedata>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",groupResponseData);
            // let filterResponseData = Object.values(groupResponseData.reduce((acc, { project_id, project_name, project_lead_name, data }) => {
            //     if (!acc[project_id]) {
            //         acc[project_id] = { project_id, project_name, project_lead_name, data: [] };
            //     }
            //     acc[project_id].data = acc[project_id].data.concat(data);
            //     return acc;
            // }, {}));

            return [error, responseData];
        }

    }

}


module.exports = projectbasedapproval;
