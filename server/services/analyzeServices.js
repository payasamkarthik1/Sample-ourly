

const TimeTrackingService = require('../services/timeTrackingService')
const EmployeeService = require('../services/employeeService')

const moment = require('moment');
const { request } = require('express');

function AnalyzeServices(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const timeTrackingService = new TimeTrackingService(objectCollection)
    const employeeService = new EmployeeService(objectCollection)

    this.getDasboardOverview = async function (request) {
        let responseData = [],
            error = true;

        //role_id = 2 and 5 for admin and super lead , get admin/superadmin (all employess) dashboard
        if (request.role_id === 2 || request.role_id === 5) {
            const [err1, data1] = await this.getadminSuperLeadMyTeamDasboardOverview(request)
            error = err1
            responseData = data1
            //role_id = 4 for lead , get lead (my team) dashboard
        } else if (request.role_id === 4) {
            const [err1, data1] = await this.getleadMyTeamDasboardOverview(request)
            error = err1
            responseData = data1
        }
        //role_id = 6 for emerging lead , get  (my team) dashboard
        else if (request.role_id === 6) {
            const [err1, data1] = await this.getEmergingLeadMyTeamDasboardOverview(request)
            error = err1
            responseData = data1
        }
        //role_id = 3 for user(employee) , get individual employee dashboard
        else if (request.role_id === 3) {
            const [err1, data1] = await this.getEmployeeDasboardOverview(request)
            error = err1
            responseData = data1
        }
        return [error, responseData]

    };

    this.getleadMyTeamDasboardOverview = async function (request) {
        let responseData = []
        let empsData = [],
            error = true;

        request.lead_assigned_employee_id = request.employee_id
        const [err1, data1] = await employeeService.getEmpsAssignUnderLeadsWithoutGroups(request)
        console.log('=======get emp=================')
        console.log(data1)
        console.log('====================================')
        if (data1.length != 0) {
            for (let i = 0; i < data1.length; i++) {
                const [err2, data2] = await this.getleadMyTeamData(request, data1[i])
                Array.prototype.push.apply(empsData, data2);
            }
            let data = []
            data = empsData
            if (data.length != 0) {
                // total time
                idGenerate = await util.getRandomNumericId()
                id = idGenerate
                totalTime = await util.calculateWorkedHours(data)

                //insert data into table for calce

                for (i = 0; i < data.length; i++) {
                    flag = 1
                    const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                }

                //get data daywise in dashboard
                flag = 2
                const [err2, data2] = await this.dashboardDataCalculation(request, id, flag)
                dayWiseData = data2

                var newArray = dayWiseData.reduce(function (acc, curr) {
                    //finding Index in the array where the NamaCategory matched
                    var findIfNameExist = acc.findIndex(function (item) {
                        return item.project_name === curr.project_name;
                    })
                    if (findIfNameExist === -1) {

                        let obj = {
                            'project_name': curr.project_name,
                            "value": [curr]
                        }
                        acc.push(obj)
                    } else {
                        acc[findIfNameExist].value.push(curr)
                    }

                    return acc;

                }, []);


                //get total projects total hours 
                flag = 3
                const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                overallProjects = data3

                //over all total_time daywise
                flag = 6
                const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                overallTotalTime = data5

                //get top project
                flag = 4
                const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                topProject = data4[0]


                // delete data
                flag = 5
                await this.dashboardDataCalculation(request, id, flag)


                responseData.push({ total_time: totalTime, top_project: topProject })
                responseData.push(newArray)
                responseData.push(overallTotalTime)
                responseData.push(overallProjects)

            }
        }
        error = false
        return [error, responseData];


    };
    this.getleadMyTeamData = async function (request, data) {
        let responseData = [],
            error = true;
        // if flag =2 get my team dashboard overview for lead
        flag = 2
        const paramsArr = new Array(
            data.employee_id,
            request.start_date,
            request.end_date,
            flag
        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

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


    };

    this.getadminSuperLeadMyTeamDasboardOverview = async function (request) {
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.employee_id,
            request.start_date,
            request.end_date,
            flag
        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data.length != 0) {
                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }

                        //get data daywise in dashboard
                        flag = 2
                        const [err2, data2] = await this.dashboardDataCalculation(request, id, flag)
                        dayWiseData = data2

                        var newArray = dayWiseData.reduce(function (acc, curr) {
                            //finding Index in the array where the NamaCategory matched
                            var findIfNameExist = acc.findIndex(function (item) {
                                return item.project_name === curr.project_name;
                            })
                            if (findIfNameExist === -1) {

                                let obj = {
                                    'project_name': curr.project_name,
                                    "value": [curr]
                                }
                                acc.push(obj)
                            } else {
                                acc[findIfNameExist].value.push(curr)
                            }

                            return acc;

                        }, []);



                        //get total projects total hours 
                        flag = 3
                        const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                        overallProjects = data3

                        //over all total_time daywise
                        flag = 6
                        const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                        overallTotalTime = data5

                        //get top project
                        flag = 4
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        topProject = data4[0]


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)

                        responseData.push({ total_time: totalTime, top_project: topProject })
                        responseData.push(newArray)
                        responseData.push(overallTotalTime)
                        responseData.push(overallProjects)

                    }
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    };

    this.getEmergingLeadMyTeamDasboardOverview = async function (request) {
        let responseData = [],
            error = true;
        // if flag =3 get my team dashboard overview for emerging lead
        flag = 3
        const paramsArr = new Array(
            request.employee_id,
            request.start_date,
            request.end_date,
            flag
        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data.length != 0) {
                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }

                        //get data daywise in dashboard
                        flag = 2
                        const [err2, data2] = await this.dashboardDataCalculation(request, id, flag)
                        dayWiseData = data2

                        var newArray = dayWiseData.reduce(function (acc, curr) {
                            //finding Index in the array where the NamaCategory matched
                            var findIfNameExist = acc.findIndex(function (item) {
                                return item.project_name === curr.project_name;
                            })
                            if (findIfNameExist === -1) {

                                let obj = {
                                    'project_name': curr.project_name,
                                    "value": [curr]
                                }
                                acc.push(obj)
                            } else {
                                acc[findIfNameExist].value.push(curr)
                            }

                            return acc;

                        }, []);


                        //get total projects total hours 
                        flag = 3
                        const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                        overallProjects = data3

                        //over all total_time daywise
                        flag = 6
                        const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                        overallTotalTime = data5

                        //get top project
                        flag = 4
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        topProject = data4[0]


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)

                    }

                    responseData.push({ total_time: totalTime, top_project: topProject })
                    responseData.push(newArray)
                    responseData.push(overallTotalTime)
                    responseData.push(overallProjects)
                    error = false
                    // responseData = data
                    return [error, responseData];
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getEmployeeDasboardOverview = async function (request) {
        total_time = {}
        dayWiseData = []
        let responseData = [],
            error = true;
        flag = 4
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data.length != 0) {
                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for data calculatiom

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }

                        //get data daywise in dashboard between start and end date
                        flag = 2
                        const [err2, data2] = await this.dashboardDataCalculation(request, id, flag)
                        dayWiseData = data2


                        var newArray = dayWiseData.reduce(function (acc, curr) {
                            //finding Index in the array where the NamaCategory matched
                            var findIfNameExist = acc.findIndex(function (item) {
                                return item.project_name === curr.project_name;
                            })
                            if (findIfNameExist === -1) {

                                let obj = {
                                    'project_name': curr.project_name,
                                    "value": [curr]
                                }
                                acc.push(obj)
                            } else {
                                acc[findIfNameExist].value.push(curr)
                            }

                            return acc;

                        }, []);

                        //get each projects total hours 
                        flag = 3
                        const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                        overallProjects = data3

                        //over all total_time daywise
                        flag = 6
                        const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                        overallTotalTime = data5

                        //get top project
                        flag = 4
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        topProject = data4[0]

                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)

                        responseData.push({ total_time: totalTime, top_project: topProject })
                        responseData.push(newArray)
                        responseData.push(overallTotalTime)
                        responseData.push(overallProjects)

                    }


                    error = false
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.dashboardDataCalculation = async function (data, id, flag) {
        let responseData = [],
            error = true;

        if (flag == 1) {
            paramsArr = new Array(
                id,
                data.employee_id,
                data.project_id,
                data.task_total_time,
                data.task_created_datetime,
                data.task_start_time,
                data.task_end_time,
                flag

            );

        } else if (flag == 2) {
            paramsArr = new Array(
                id,
                null,
                null,
                null,
                null,
                null,
                null,
                flag

            );

        }
        else if (flag == 3) {
            paramsArr = new Array(
                id,
                null,
                null,
                null,
                null,
                null,
                null,
                flag

            );

        }
        else if (flag == 4) {
            paramsArr = new Array(
                id,
                null,
                null,
                null,
                null,
                null,
                null,
                flag

            );

        }
        else if (flag == 5) {
            paramsArr = new Array(
                id,
                null,
                null,
                null,
                null,
                null,
                null,
                flag

            );

        }
        else if (flag == 6) {
            paramsArr = new Array(
                id,
                null,
                null,
                null,
                null,
                null,
                null,
                flag

            );

        }
        else if (flag == 7) {
            paramsArr = new Array(
                id,
                null,
                null,
                null,
                null,
                null,
                null,
                flag

            );

        }

        const queryString = util.getQueryString('dashboard_data_calculation', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    error = false
                    responseData = data

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getAllTasksFilterByDescrip = async function (request) {
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.start_date,
            request.end_date,
            request.employee_id,
            flag
        );

        const queryString = util.getQueryString('dashboard_get_top_tasks_filter_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=======getAllTasksFilterByDescrip======');
                    console.log(data);
                    console.log('====================================');
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getTopProjectBasedOnHrs = async function (request) {
        if (request.role_id == 3) {
            let responseData = [],
                error = true;
            //flag =6 for total hours calculation for all projects for a given week 
            flag = 6
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                0,
                flag
            );

            const queryString = util.getQueryString('timetracking_timeline_worked_hours_calculation', paramsArr);

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
        } else if (request.role_id == 4) {
            let responseData = [],
                error = true;
            //flag =6 for total hours calculation for all projects for a given week 
            flag = 6
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                flag
            );

            const queryString = util.getQueryString('dashboard_get_lead_my_teams_dashboard_overview_select', paramsArr);

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

        } else if (request.role_id == 2 || request.role_id == 5) {
            let responseData = [],
                error = true;
            //flag =6 for total hours calculation for all projects for a given week 
            flag = 6
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                flag
            );
            const queryString = util.getQueryString('dashboard_get_admin_all_emps_dashboard_overview_select', paramsArr);

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
    };





    this.getAllTasksInWeekByEmpId = async function (request) {
        let responseData = []
        obj = {}
        obj.firstWeekDay = (request.first_week_day)
        obj.lastWeekDay = (request.last_week_day)
        const [err, data1] = await timeTrackingService.getAllTasksInThatWeeks(request, obj)
        responseData.push(data1)
        return [err, responseData];

    };

    // this.getReportSummary = async function (request) {
    //     if (request.role_id == 3) {
    //         let responseData = [],
    //             error = true;
    //         flag = 1
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             flag
    //         );

    //         const queryString = util.getQueryString('reports_get_summary', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     const [err1, data1] = await this.getTopProjectBasedOnHrs(request)
    //                     if (data1.length != 0) {
    //                         const [err2, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                         let totalTime = data2[0].weekHours
    //                         let topProject = data1[0].project_name
    //                         let topClient = data1[0].client_name
    //                         let color_code = data1[0].project_color_code
    //                         let project_code = data1[0].project_code
    //                         data.unshift({ totalTime, topProject, topClient, color_code, project_code })
    //                         responseData = data;
    //                         error = false
    //                     } else {
    //                         responseData = [];
    //                         error = false
    //                     }

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }
    //     } else if (request.role_id == 4) {
    //         let responseData = [],
    //             error = true;
    //         flag = 2
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             flag
    //         );

    //         const queryString = util.getQueryString('reports_get_summary', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     console.log('=======startung===========')
    //                     console.log(data)
    //                     console.log('====================================')
    //                     const [err1, data1] = await this.getTopProjectBasedOnHrs(request)
    //                     const [err2, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                     let totalTime = data2[0].weekHours
    //                     let topProject = data1[0].project_name
    //                     let topClient = data1[0].client_name
    //                     let color_code = data1[0].project_color_code
    //                     let project_code = data1[0].project_code
    //                     data.unshift({ totalTime, topProject, topClient, color_code, project_code })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }


    //     } else if (request.role_id == 2) {
    //         let responseData = [],
    //             error = true;
    //         flag = 3
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             flag
    //         );

    //         const queryString = util.getQueryString('reports_get_summary', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     //flag =1 for individual user
    //                     flag = 3
    //                     const [err1, data1] = await this.getTopProjectBasedOnHrs(request, flag)
    //                     const [err2, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request, flag)
    //                     let totalTime = data2[0].weekHours
    //                     let topProject = data1[0].project_name
    //                     let topClient = data1[0].client_name
    //                     let color_code = data1[0].project_color_code
    //                     let project_code = data1[0].project_code
    //                     data.unshift({ totalTime, topProject, topClient, color_code, project_code })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }


    //     }

    // }

    // this.getReportSummary = async function (request) {
    //     if (request.role_id == 3) {
    //         let responseData = [],
    //             error = true;

    //         const paramsArr = new Array(
    //             request.employee_id,
    //             request.start_date,
    //             request.end_date,

    //         );

    //         const queryString = util.getQueryString('v1_timetracking_timeline_worked_hours_calculation', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     const [err1, data1] = await this.getFilterReportSummary(request, data)

    //                     responseData = data1;
    //                     error = err1
    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }
    //     } else if (request.role_id == 4) {
    //         let responseData = [],
    //             error = true;
    //         flag = 2
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             flag
    //         );

    //         const queryString = util.getQueryString('reports_get_summary', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     console.log('=======startung===========')
    //                     console.log(data)
    //                     console.log('====================================')
    //                     const [err1, data1] = await this.getTopProjectBasedOnHrs(request)
    //                     const [err2, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                     let totalTime = data2[0].weekHours
    //                     let topProject = data1[0].project_name
    //                     let topClient = data1[0].client_name
    //                     let color_code = data1[0].project_color_code
    //                     let project_code = data1[0].project_code
    //                     data.unshift({ totalTime, topProject, topClient, color_code, project_code })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }


    //     } else if (request.role_id == 2) {
    //         let responseData = [],
    //             error = true;
    //         flag = 3
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             flag
    //         );

    //         const queryString = util.getQueryString('reports_get_summary', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     //flag =1 for individual user
    //                     flag = 3
    //                     const [err1, data1] = await this.getTopProjectBasedOnHrs(request, flag)
    //                     const [err2, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request, flag)
    //                     let totalTime = data2[0].weekHours
    //                     let topProject = data1[0].project_name
    //                     let topClient = data1[0].client_name
    //                     let color_code = data1[0].project_color_code
    //                     let project_code = data1[0].project_code
    //                     data.unshift({ totalTime, topProject, topClient, color_code, project_code })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }


    //     }

    // }

    // this.getReportDetailed = async function (request) {
    //     if (request.role_id == 3) {
    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             1
    //         );

    //         const queryString = util.getQueryString('reports_get_detailed', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     console.log('====================================')
    //                     console.log(data)
    //                     console.log('====================================')
    //                     flag = 1
    //                     const [err1, data1] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request, flag)
    //                     let totalTime = data1[0].weekHours
    //                     data.unshift({ totalTime })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }
    //     } else if (request.role_id == 4) {

    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             2
    //         );

    //         const queryString = util.getQueryString('reports_get_detailed', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     console.log('=======lead===============');
    //                     console.log(data);
    //                     console.log('====================================');

    //                     const [err1, data1] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                     let totalTime = data1[0].weekHours
    //                     data.unshift({ totalTime })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }


    //     } else if (request.role_id == 2) {


    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             3
    //         );

    //         const queryString = util.getQueryString('reports_get_detailed', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     console.log('==========LENGTH====')
    //                     console.log(data.length)
    //                     console.log('====================================')
    //                     const [err1, data1] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                     let totalTime = data1[0].weekHours
    //                     data.unshift({ totalTime })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }


    //     }


    // };

    // this.getReportWeekly = async function (request) {
    //     if (request.role_id == 3) {
    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             1
    //         );

    //         const queryString = util.getQueryString('reports_get_weekly', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     const [err2, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
    //                     const [err1, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                     data.filter(function (o1, i) {
    //                         data1.some(function (o2) {
    //                             if (o1.project_id === o2.project_id) {
    //                                 data[i].total_hour = o2.total_hours
    //                             }
    //                         });
    //                     });
    //                     let totalTime = data2[0].weekHours
    //                     data.unshift({ totalTime })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }
    //     } else if (request.role_id == 4) {
    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             2
    //         );

    //         const queryString = util.getQueryString('reports_get_weekly', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     const [err2, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
    //                     const [err1, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                     data.filter(function (o1, i) {
    //                         data1.some(function (o2) {
    //                             if (o1.project_id === o2.project_id) {
    //                                 data[i].total_hour = o2.total_hours
    //                             }
    //                         });
    //                     });
    //                     let totalTime = data2[0].weekHours
    //                     data.unshift({ totalTime })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }
    //     } else if (request.role_id == 2) {
    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             request.first_week_day,
    //             request.last_week_day,
    //             request.employee_id,
    //             3
    //         );

    //         const queryString = util.getQueryString('reports_get_weekly', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(1, queryString, request)
    //                 .then(async (data) => {
    //                     const [err2, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
    //                     const [err1, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
    //                     data.filter(function (o1, i) {
    //                         data1.some(function (o2) {
    //                             if (o1.project_id === o2.project_id) {
    //                                 data[i].total_hour = o2.total_hours
    //                             }
    //                         });
    //                     });
    //                     let totalTime = data2[0].weekHours
    //                     data.unshift({ totalTime })
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     console.log("err-------" + err);
    //                     error = err
    //                 })
    //             return [error, responseData];
    //         }
    //     }

    // };



    //filter
    this.getFilterReportSummary = async function (request, data) {

        console.log('====================================')
        console.log(data)
        console.log('====================================')

        filterClients1 = []
        filterProjects1 = []
        filterTags1 = []
        filterStatus1 = []
        client_id = request.client_ids
        project_id = request.project_ids
        tag_id = request.tag_ids
        status_id = request.status_ids

        if (client_id.length == 0 && project_id.length == 0 && tag_id.length == 0 && status_id.length == 0) {
            console.log('====================================')
            console.log("entered all empty")
            console.log('====================================')
            // data = data
            return [false, data]

        } else if (client_id.length != 0 && project_id.length != 0 && tag_id.length != 0 && status_id.length != 0) {
            console.log('====================================')
            console.log("entered all not empty")
            console.log('====================================')
            if (client_id != []) {
                for (let i = 0; i < client_id.length; i++) {
                    data.filter(function (data) {
                        if (data.client_id == client_id[i]) {
                            filterClients1.push(data)
                        }
                    })
                }

            }
            else if (project_id != []) {
                for (let i = 0; i < project_id.length; i++) {
                    filterClient1.filter(function (data) {
                        if (data.project_id == project_id[i]) {
                            filterProjects1.push(data)
                        }
                    })
                }
            }
            else if (tag_id != []) {
                for (let i = 0; i < tag_id.length; i++) {
                    filterProjects1.filter(function (data) {
                        if (data.tag_id == tag_id[i]) {
                            filterTags1.push(data)
                        }
                    })
                }
            }
            else if (status_id != []) {
                for (let i = 0; i < status_id.length; i++) {
                    filterTags1.filter(function (data) {
                        if (data.status_id == status_id[i]) {
                            filterStatus1.push(data)

                        }
                    })
                }
                console.log('=====jfnkf=============')
                console.log(filterStatus)
                console.log('====================================')
            }
            return [false, filterStatus1]
        } else {
            console.log('====================================')
            console.log("entered any empty")
            console.log(project_id.length != 0)
            console.log('====================================')

            if (client_id.length == 0) {
                console.log("enter client 0");
                filterClients1 = data

            } if (client_id.length != 0) {
                for (let i = 0; i < client_id.length; i++) {
                    data.filter(function (data) {
                        if (data.client_id == client_id[i]) {
                            filterClients1.push(data)
                        }
                    })
                }
            } if (project_id.length == 0) {
                console.log("enter project 0");
                filterProjects1 = filterClient1
            } if (project_id.length != 0) {

                for (let i = 0; i < project_id.length; i++) {
                    filterClients1.filter(function (data) {
                        if (data.project_id == project_id[i]) {
                            filterProjects1.push(data)
                        }
                    })
                }

            } if (tag_id.length == 0) {
                console.log("enter tag 0");
                filterTags1 = filterProjects1
            } if (tag_id.length != 0) {
                for (let i = 0; i < tag_id.length; i++) {
                    filterProjects1.filter(function (data) {
                        if (data.tag_id == tag_id[i]) {
                            filterTags1.push(data)
                        }
                    })
                }
            } if (status_id.length == 0) {
                console.log("------------------enter status 0");
                filterStatus1 = filterTags1
            } if (status_id.length != 0) {
                for (let i = 0; i < status_id.length; i++) {
                    filterTags1.filter(function (data) {
                        if (data.status_id == status_id[i]) {
                            filterStatus1.push(data)
                        }
                    })
                }
            }
            data = filterStatus1


            console.log('=====filter======')
            console.log(data)
            console.log('====================================')
            return [false, data]

        }




    }




    this.getadminSuperLeadMyTeamReportSummary = async function (request) {
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.employee_id,
            request.start_date,
            request.end_date,

            flag
        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data.length != 0) {
                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }

                        //get data daywise in dashboard
                        flag = 2
                        const [err2, data2] = await this.dashboardDataCalculation(request, id, flag)
                        dayWiseData = data2

                        // var daylist = getDaysArray(new Date(dayWiseData[0].task_created_datetime), new Date(dayWiseData[dayWiseData.length-1].task_created_datetime));
                        // daylist.map((v) => v.toISOString().slice(0, 10)).join("")

                        // for (let i = 0; i < daylist.length; i++) {
                        //     dayWiseData.filter(function (data) {
                        //         if (data.task_created_datetime == client_id[i]) {
                        //             filterClients1.push(data)
                        //         }
                        //     })
                        // }



                        //get total projects total hours 
                        flag = 3
                        const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                        overallProjects = data3

                        //get top project
                        flag = 4
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        topProject = data4[0]


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)

                        responseData.push({ total_time: totalTime, top_project: topProject })
                        responseData.push(dayWiseData)
                        responseData.push(overallProjects)

                    }
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    };

    // this.getleadMyTeamDasboardOverview = async function (request) {
    //     let responseData = []
    //     let empsData = [],
    //         error = true;

    //     request.lead_assigned_employee_id = request.employee_id
    //     const [err1, data1] = await employeeService.getEmpsAssignUnderLeadsWithoutGroups(request)
    //     console.log('=======get emp=================')
    //     console.log(data1)
    //     console.log('====================================')
    //     if (data1.length != 0) {
    //         for (let i = 0; i < data1.length; i++) {
    //             const [err2, data2] = await this.getleadMyTeamData(request, data1[i])
    //             Array.prototype.push.apply(empsData, data2);
    //         }
    //         let data = []
    //         data = empsData
    //         if (data.length != 0) {
    //             // total time
    //             idGenerate = await util.getRandomNumericId()
    //             id = idGenerate
    //             totalTime = await util.calculateWorkedHours(data)

    //             //insert data into table for calce

    //             for (i = 0; i < data.length; i++) {
    //                 flag = 1
    //                 const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
    //             }

    //             //get data daywise in dashboard
    //             flag = 2
    //             const [err2, data2] = await this.dashboardDataCalculation(request, id, flag)
    //             dayWiseData = data2

    //             // var daylist = getDaysArray(new Date(dayWiseData[0].task_created_datetime), new Date(dayWiseData[dayWiseData.length-1].task_created_datetime));
    //             // daylist.map((v) => v.toISOString().slice(0, 10)).join("")

    //             // for (let i = 0; i < daylist.length; i++) {
    //             //     dayWiseData.filter(function (data) {
    //             //         if (data.task_created_datetime == client_id[i]) {
    //             //             filterClients1.push(data)
    //             //         }
    //             //     })
    //             // }



    //             //get total projects total hours 
    //             flag = 3
    //             const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
    //             overallProjects = data3

    //             //get top project
    //             flag = 4
    //             const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
    //             topProject = data4[0]


    //             // delete data
    //             flag = 5
    //             await this.dashboardDataCalculation(request, id, flag)


    //             responseData.push({ total_time: totalTime, top_project: topProject })
    //             responseData.push(dayWiseData)
    //             responseData.push(overallProjects)

    //         }
    //     }
    //     error = false
    //     return [error, responseData];


    // };
    // this.getleadMyTeamData = async function (request, data) {
    //     let responseData = [],
    //         error = true;
    //     // if flag =1 get my team dashboard overview for lead
    //     flag = 4
    //     const paramsArr = new Array(
    //         data.employee_id,
    //         request.start_date,
    //         request.end_date,
    //         flag
    //     );

    //     const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then(async (data) => {
    //                 responseData = data;
    //                 error = false
    //             }).catch((err) => {
    //                 console.log("err-------" + err);
    //                 error = err
    //             })
    //         return [error, responseData];
    //     }


    // };

    // this.getEmergingLeadMyTeamDasboardOverview = async function (request) {
    //     let responseData = [],
    //         error = true;
    //     // if flag =3 get my team dashboard overview for emerging lead
    //     flag = 3
    //     const paramsArr = new Array(
    //         request.employee_id,
    //         request.start_date,
    //         request.end_date,
    //         flag
    //     );

    //     const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then(async (data) => {
    //                 if (data.length != 0) {
    //                     // total time
    //                     idGenerate = await util.getRandomNumericId()
    //                     id = idGenerate
    //                     totalTime = await util.calculateWorkedHours(data)

    //                     //insert data into table for calce

    //                     for (i = 0; i < data.length; i++) {
    //                         flag = 1
    //                         const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
    //                     }

    //                     //get data daywise in dashboard
    //                     flag = 2
    //                     const [err2, data2] = await this.dashboardDataCalculation(request, id, flag)
    //                     dayWiseData = data2

                     
    //                     //get total projects total hours 
    //                     flag = 3
    //                     const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
    //                     overallProjects = data3

    //                     //get top project
    //                     flag = 4
    //                     const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
    //                     topProject = data4[0]


    //                     // delete data
    //                     flag = 5
    //                     await this.dashboardDataCalculation(request, id, flag)

    //                 }

    //                 responseData.push({ total_time: totalTime, top_project: topProject })
    //                 responseData.push(dayWiseData)
    //                 responseData.push(overallProjects)
    //                 error = false
    //                 // responseData = data
    //                 return [error, responseData];
    //             }).catch((err) => {
    //                 console.log("err-------" + err);
    //                 error = err
    //             })
    //         return [error, responseData];
    //     }


    // };



    this.getReportSummary = async function (request) {
        let responseData = [],
            error = true;

        //role_id = 2 and 5 for admin and super lead , get admin/superadmin (all employess) dashboard
        if (request.role_id === 2 || request.role_id === 5) {
            const [err1, data1] = await this.getadminSuperLeadMyTeamReportSummary(request)
            error = err1
            responseData = data1
            //role_id = 4 for lead , get lead (my team) dashboard
        } else if (request.role_id === 4) {
            const [err1, data1] = await this.getLeadMyTeamReportSummary(request)
            error = err1
            responseData = data1
        }
        //role_id = 6 for emerging lead , get  (my team) dashboard
        else if (request.role_id === 6) {
            const [err1, data1] = await this.getEmergingLeadMyTeamReportSummary(request)
            error = err1
            responseData = data1
        }
        //role_id = 3 for user(employee) , get individual employee dashboard
        else if (request.role_id === 3) {
            const [err1, data1] = await this.getEmployeeMyTeamReportSummary(request)
            error = err1
            responseData = data1
        }
        return [error, responseData]

    };
    this.getReportDetailed = async function (request) {
        let responseData = [],
            error = true;

        //role_id = 2 and 5 for admin and super lead , get admin/superadmin (all employess) dashboard
        if (request.role_id === 2 || request.role_id === 5) {
            const [err1, data1] = await this.getAdminSuperLeadMyTeamReportDetailed(request)
            error = err1
            responseData = data1
            //role_id = 4 for lead , get lead (my team) dashboard
        } else if (request.role_id === 4) {
            const [err1, data1] = await this.getLeadMyTeamReportDetailed(request)
            error = err1
            responseData = data1
        }
        //role_id = 6 for emerging lead , get  (my team) dashboard
        else if (request.role_id === 6) {
            const [err1, data1] = await this.getEmergingLeadMyTeamReportDetailed(request)
            error = err1
            responseData = data1
        }
        //role_id = 3 for user(employee) , get individual employee dashboard
        else if (request.role_id === 3) {
            const [err1, data1] = await this.getEmployeeMyTeamReportDetailed(request)
            error = err1
            responseData = data1
        }
        return [error, responseData]

    };
    this.getReportWeekly = async function (request) {
        let responseData = [],
            error = true;

        //role_id = 2 and 5 for admin and super lead , get admin/superadmin (all employess) dashboard
        if (request.role_id === 2 || request.role_id === 5) {
            const [err1, data1] = await this.getAdminSuperLeadMyTeamReportWeekly(request)
            error = err1
            responseData = data1
            //role_id = 4 for lead , get lead (my team) dashboard
        } else if (request.role_id === 4) {
            const [err1, data1] = await this.getLeadMyTeamReportWeekly(request)
            error = err1
            responseData = data1
        }
        //role_id = 6 for emerging lead , get  (my team) dashboard
        else if (request.role_id === 6) {
            const [err1, data1] = await this.getEmergingLeadMyTeamReportWeekly(request)
            error = err1
            responseData = data1
        }
        //role_id = 3 for user(employee) , get individual employee dashboard
        else if (request.role_id === 3) {
            const [err1, data1] = await this.getEmployeeMyTeamReportWeekly(request)
            error = err1
            responseData = data1
        }
        return [error, responseData]

    };



    this.getEmployeeMyTeamReportSummary = async function (request) {
        total_time = {}
        dayWiseData = []
        let responseData = [],
            error = true;
        flag = 4
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }
                        //get total projects total hours 
                        flag = 3
                        const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                        overallProjects = data3

                        //over all total_time daywise
                        flag = 6
                        const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                        overallTotalTime = data5

                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)

                        responseData.push({ total_time: totalTime })
                        responseData.push(overallTotalTime)
                        responseData.push(overallProjects)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };
    this.getEmployeeMyTeamReportDetailed = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        flag = 4
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }


                        //get detailed data
                        flag = 7
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        console.log('====================================');
                        console.log(data4);
                        console.log('====================================');
                        detailedData = data4


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)
                        responseData.push({ total_time: totalTime })
                        responseData.push(detailedData)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };
    this.getEmployeeMyTeamReportWeekly = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        flag = 4
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            await this.dashboardDataCalculation(data[i], id, flag)
                        }


                        //get detailed data
                        flag = 7
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        console.log('=========detailllelled============');
                        console.log(data4);
                        console.log('====================================');
                        detailedData = data4


                        var newArray = detailedData.reduce(function (acc, curr) {
                            //finding Index in the array where the NamaCategory matched
                            var findIfNameExist = acc.findIndex(function (item) {
                                return item.project_id === curr.project_id;
                            })
                            if (findIfNameExist === -1) {


                                let obj = {
                                    'project_id': curr.project_id,
                                    "value": [curr]
                                }
                                acc.push(obj)
                            } else {
                                acc[findIfNameExist].value.push(curr)
                            }

                            return acc;

                        }, []);

                        console.log('=========-------------new array===========')
                        console.log(newArray)
                        console.log('====================================')


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)
                        responseData.push({ total_time: totalTime })
                        responseData.push(newArray)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };


    this.getEmergingLeadMyTeamReportSummary = async function (request) {
        total_time = {}
        dayWiseData = []
        let responseData = [],
            error = true;
        flag = 3
        const paramsArr = new Array(
            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }
                        //get total projects total hours 
                        flag = 3
                        const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                        overallProjects = data3

                        //over all total_time daywise
                        flag = 6
                        const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                        overallTotalTime = data5

                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)

                        responseData.push({ total_time: totalTime })
                        responseData.push(overallTotalTime)
                        responseData.push(overallProjects)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };
    this.getEmergingLeadMyTeamReportDetailed = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        flag = 3
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }


                        //get detailed data
                        flag = 7
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        console.log('====================================');
                        console.log(data4);
                        console.log('====================================');
                        detailedData = data4


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)
                        responseData.push({ total_time: totalTime })
                        responseData.push(detailedData)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };
    this.getEmergingLeadMyTeamReportWeekly = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        flag = 3
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            await this.dashboardDataCalculation(data[i], id, flag)
                        }


                        //get detailed data
                        flag = 7
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        console.log('=========detailllelled============');
                        console.log(data4);
                        console.log('====================================');
                        detailedData = data4


                        var newArray = detailedData.reduce(function (acc, curr) {
                            //finding Index in the array where the NamaCategory matched
                            var findIfNameExist = acc.findIndex(function (item) {
                                return item.project_id === curr.project_id;
                            })
                            if (findIfNameExist === -1) {


                                let obj = {
                                    'project_id': curr.project_id,
                                    "value": [curr]
                                }
                                acc.push(obj)
                            } else {
                                acc[findIfNameExist].value.push(curr)
                            }

                            return acc;

                        }, []);

                        console.log('=========-------------new array===========')
                        console.log(newArray)
                        console.log('====================================')


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)
                        responseData.push({ total_time: totalTime })
                        responseData.push(newArray)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };


    this.getLeadMyTeamReportSummary = async function (request) {
        total_time = {}
        dayWiseData = []
        let responseData = [],
            error = true;
        request.lead_assigned_employee_id = request.employee_id
        const [err1, data1] = await employeeService.getEmpsAssignUnderLeadsWithoutGroups(request)
        console.log('=======get emp=================')
        console.log(data1)
        console.log('====================================')
        if (data1.length != 0) {
            for (let i = 0; i < data1.length; i++) {
                const [err2, data2] = await this.getleadMyTeamData(request, data1[i])
                Array.prototype.push.apply(empsData, data2);

                let data = []
                data = empsData
                if (data.length != 0) {
                    const [err1, data] = await this.getFilterReportSummary(request, data)

                    // total time
                    idGenerate = await util.getRandomNumericId()
                    id = idGenerate
                    totalTime = await util.calculateWorkedHours(data)

                    //insert data into table for calce

                    for (i = 0; i < data.length; i++) {
                        flag = 1
                        const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                    }
                    //get total projects total hours 
                    flag = 3
                    const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                    overallProjects = data3

                    //over all total_time daywise
                    flag = 6
                    const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                    overallTotalTime = data5

                    // delete data
                    flag = 5
                    await this.dashboardDataCalculation(request, id, flag)

                    responseData.push({ total_time: totalTime })
                    responseData.push(overallTotalTime)
                    responseData.push(overallProjects)

                }
            }


            error = false
            // responseData = data
            return [error, responseData];



            return [error, responseData];
        }


    };
    this.getLeadMyTeamReportDetailed = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        request.lead_assigned_employee_id = request.employee_id
        const [err1, data1] = await employeeService.getEmpsAssignUnderLeadsWithoutGroups(request)
        console.log('=======get emp=================')
        console.log(data1)
        console.log('====================================')


        if (data1.length != 0) {
            for (let i = 0; i < data1.length; i++) {
                const [err2, data2] = await this.getleadMyTeamData(request, data1[i])
                Array.prototype.push.apply(empsData, data2);

                let data = []
                data = empsData
                if (data.length != 0) {
                    const [err1, data] = await this.getFilterReportSummary(request, data)

                    // total time
                    idGenerate = await util.getRandomNumericId()
                    id = idGenerate
                    totalTime = await util.calculateWorkedHours(data)

                    //insert data into table for calce

                    for (i = 0; i < data.length; i++) {
                        flag = 1
                        const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                    }


                    //get detailed data
                    flag = 7
                    const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                    console.log('====================================');
                    console.log(data4);
                    console.log('====================================');
                    detailedData = data4


                    // delete data
                    flag = 5
                    await this.dashboardDataCalculation(request, id, flag)
                    responseData.push({ total_time: totalTime })
                    responseData.push(detailedData)

                }
            }


            error = false
            // responseData = data
            return [error, responseData];


            return [error, responseData];
        }


    };
    this.getLeadMyTeamReportWeekly = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        request.lead_assigned_employee_id = request.employee_id
        const [err1, data1] = await employeeService.getEmpsAssignUnderLeadsWithoutGroups(request)
        console.log('=======get emp=================')
        console.log(data1)
        console.log('====================================')

        if (data1.length != 0) {
            for (let i = 0; i < data1.length; i++) {
                const [err2, data2] = await this.getleadMyTeamData(request, data1[i])
                Array.prototype.push.apply(empsData, data2);

                let data = []
                data = empsData
                if (data.length != 0) {
                    const [err1, data] = await this.getFilterReportSummary(request, data)

                    // total time
                    idGenerate = await util.getRandomNumericId()
                    id = idGenerate
                    totalTime = await util.calculateWorkedHours(data)

                    //insert data into table for calce

                    for (i = 0; i < data.length; i++) {
                        flag = 1
                        await this.dashboardDataCalculation(data[i], id, flag)
                    }


                    //get detailed data
                    flag = 7
                    const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                    console.log('=========detailllelled============');
                    console.log(data4);
                    console.log('====================================');
                    detailedData = data4


                    var newArray = detailedData.reduce(function (acc, curr) {
                        //finding Index in the array where the NamaCategory matched
                        var findIfNameExist = acc.findIndex(function (item) {
                            return item.project_id === curr.project_id;
                        })
                        if (findIfNameExist === -1) {


                            let obj = {
                                'project_id': curr.project_id,
                                "value": [curr]
                            }
                            acc.push(obj)
                        } else {
                            acc[findIfNameExist].value.push(curr)
                        }

                        return acc;

                    }, []);

                    console.log('=========-------------new array===========')
                    console.log(newArray)
                    console.log('====================================')


                    // delete data
                    flag = 5
                    await this.dashboardDataCalculation(request, id, flag)
                    responseData.push({ total_time: totalTime })
                    responseData.push(newArray)

                }
            }
            error = false
            // responseData = data
            return [error, responseData];

            return [error, responseData];
        }


    };


    this.getAdminSuperLeadMyTeamReportSummary = async function (request) {
        total_time = {}
        dayWiseData = []
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }
                        //get total projects total hours 
                        flag = 3
                        const [err3, data3] = await this.dashboardDataCalculation(request, id, flag)
                        overallProjects = data3

                        //over all total_time daywise
                        flag = 6
                        const [err5, data5] = await this.dashboardDataCalculation(request, id, flag)
                        overallTotalTime = data5

                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)

                        responseData.push({ total_time: totalTime })
                        responseData.push(overallTotalTime)
                        responseData.push(overallProjects)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };
    this.getAdminSuperLeadMyTeamReportDetailed = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            const [err1, data1] = await this.dashboardDataCalculation(data[i], id, flag)
                        }


                        //get detailed data
                        flag = 7
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        console.log('====================================');
                        console.log(data4);
                        console.log('====================================');
                        detailedData = data4


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)
                        responseData.push({ total_time: totalTime })
                        responseData.push(detailedData)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };
    this.getAdminSuperLeadMyTeamReportWeekly = async function (request) {
        total_time = {}
        detailedData = []
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(

            request.employee_id,
            request.start_date,
            request.end_date,
            flag

        );

        const queryString = util.getQueryString('dashboard_get_data_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dat) => {
                    if (dat.length != 0) {
                        const [err1, data] = await this.getFilterReportSummary(request, dat)

                        // total time
                        idGenerate = await util.getRandomNumericId()
                        id = idGenerate
                        totalTime = await util.calculateWorkedHours(data)

                        //insert data into table for calce

                        for (i = 0; i < data.length; i++) {
                            flag = 1
                            await this.dashboardDataCalculation(data[i], id, flag)
                        }


                        //get detailed data
                        flag = 7
                        const [err4, data4] = await this.dashboardDataCalculation(request, id, flag)
                        console.log('=========detailllelled============');
                        console.log(data4);
                        console.log('====================================');
                        detailedData = data4


                        var newArray = detailedData.reduce(function (acc, curr) {
                            //finding Index in the array where the NamaCategory matched
                            var findIfNameExist = acc.findIndex(function (item) {
                                return item.project_id === curr.project_id;
                            })
                            if (findIfNameExist === -1) {


                                let obj = {
                                    'project_id': curr.project_id,
                                    "value": [curr]
                                }
                                acc.push(obj)
                            } else {
                                acc[findIfNameExist].value.push(curr)
                            }

                            return acc;

                        }, []);

                        console.log('=========-------------new array===========')
                        console.log(newArray)
                        console.log('====================================')


                        // delete data
                        flag = 5
                        await this.dashboardDataCalculation(request, id, flag)
                        responseData.push({ total_time: totalTime })
                        responseData.push(newArray)

                    }


                    error = false
                    // responseData = data
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

}



module.exports = AnalyzeServices;
