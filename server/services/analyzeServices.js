

const TimeTrackingService = require('../services/timeTrackingService')
const moment = require('moment');
const { request } = require('express');

function AnalyzeServices(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const timeTrackingService = new TimeTrackingService(objectCollection)


    this.getAllTasksWeeklyFilterByDescrip = async function (request) {
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            request.employee_id,
            flag
        );

        const queryString = util.getQueryString('dashboard_get_top_tasks_filter_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
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

    this.getEmployeeDasboardOverview = async function (request) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
        );

        const queryString = util.getQueryString('timesheet_get_all_projects_worked_hours_weekly', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=====timesheet_get_all_projects_worked_hours_weekly==========')
                    console.log(data)
                    console.log('====================================')
                    if (!(data.length == 0)) {
                        const [err1, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
                        const [err2, data2] = await timeTrackingService.getWorkedHrsOfAllPrjsInDay(request)
                        const [err3, data3] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        const [err4, data4] = await this.getTopProjectBasedOnHrs(request)


                        data4.forEach(function (object, i) {
                            var array = object.highest.split(":");
                            var seconds = (parseInt(array[0], 10) * 60 * 60) + (parseInt(array[1], 10) * 60) + parseInt(array[2], 10)
                            object.num = seconds

                        })
                        data.push(data2[0])
                        data.filter(function (o1, i) {
                            data1.some(function (o2) {
                                if (o1.project_id === o2.project_id) {
                                    data[i].total_hour = o2.total_hours
                                }
                            });
                        });



                        let totalTime = data3[0].weekHours
                        let topProject = data4[0].project_name
                        let topClient = data4[0].client_name


                        //adding submited and approved in object based on flag
                        const [err6, data6] = await timeTrackingService.getSubmittedApproveEntries(request, 3)
                        console.log('==========Data6=============')
                        console.log(data6)
                        console.log(data6 === [])
                        console.log('====================================')

                        if (data6 === []) {
                            console.log('====================================')
                            console.log("enter in submit state")
                            console.log('====================================')
                            data.unshift({ totalTime, topProject, topClient })
                        } else {
                            if (data6[0].approved_on_datetime != null) {
                                const [err5, data5] = await timeTrackingService.getSubmittedApproveEntries(request, 1)
                                week_name = data5[0].submitted_by.concat("," + data5[0].week_name)
                                submited_by = data5[0].submitted_by.concat("(" + data5[0].submited_for_approval_datetime + ")")
                                const [err6, data6] = await timeTrackingService.getSubmittedApproveEntries(request, 2)

                                approved_by = data6[0].approved_by.concat("(" + data6[0].approved_on_datetime + ")")
                                data.unshift({ week_name, submited_by, approved_by, totalTime, topProject, topClient })

                            } else {
                                const [err5, data5] = await timeTrackingService.getSubmittedApproveEntries(request, 1)
                                week_name = data5[0].submitted_by.concat("," + data5[0].week_name)
                                submited_by = data5[0].submitted_by.concat("(" + data5[0].submited_for_approval_datetime + ")")
                                data.unshift({ week_name, submited_by, totalTime, topProject, topClient })
                            }
                        }
                        console.log(data);
                        responseData = data;
                        error = false

                    } else {
                        responseData = data;
                        error = false
                    }
                    return [error, responseData];


                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getleadMyTeamDasboardOverview = async function (request) {
        let responseData = [],
            error = true;
        // if flag =1 get my team dashboard overview for lead
        flag = 1
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
                    console.log('========TEAM=============')
                    console.log(data)
                    console.log('====================================')
                    const [err1, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
                    const [err2, data2] = await timeTrackingService.getWorkedHrsOfAllPrjsInDay(request)
                    const [err3, data3] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                    const [err4, data4] = await this.getTopProjectBasedOnHrs(request)

                    data4.forEach(function (object, i) {
                        var array = object.highest.split(":");
                        var seconds = (parseInt(array[0], 10) * 60 * 60) + (parseInt(array[1], 10) * 60) + parseInt(array[2], 10)
                        object.num = seconds

                    })
                    data.push(data2[0])
                    data.filter(function (o1, i) {
                        data1.some(function (o2) {
                            if (o1.project_id === o2.project_id) {
                                data[i].total_hour = o2.total_hours
                            }
                        });
                    });

                    let totalTime = data3[0].weekHours
                    let topProject = data4[0].project_name
                    let topClient = data4[0].client_name

                    data.unshift({ totalTime, topProject, topClient })
                    console.log(data);
                    responseData = data;
                    error = false

                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getadminAllEmpsDasboardOverview = async function (request) {
        let responseData = [],
            error = true;
        flag = 1
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
                    const [err1, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
                    const [err2, data2] = await timeTrackingService.getWorkedHrsOfAllPrjsInDay(request)
                    const [err3, data3] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                    const [err4, data4] = await this.getTopProjectBasedOnHrs(request)
                    data4.forEach(function (object, i) {
                        var array = object.highest.split(":");
                        var seconds = (parseInt(array[0], 10) * 60 * 60) + (parseInt(array[1], 10) * 60) + parseInt(array[2], 10)
                        object.num = seconds
                    })
                    data.push(data2[0])
                    data.filter(function (o1, i) {
                        data1.some(function (o2) {
                            if (o1.project_id === o2.project_id) {
                                data[i].total_hour = o2.total_hours
                            }
                        });
                    });

                    let totalTime = data3[0].weekHours
                    let topProject = data4[0].project_name
                    let topClient = data4[0].client_name

                    data.unshift({ totalTime, topProject, topClient })
                    console.log(data);
                    responseData = data;
                    error = false

                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getDasboardOverview = async function (request) {
        let responseData = [],
            error = true;
        //role_id = 3 for user(employee) , get individual employee dashboard
        if (request.role_id === 3) {
            const [err1, data1] = await this.getEmployeeDasboardOverview(request)
            error = err1
            responseData = data1
        }
        //role_id = 2 for admin , get admin (all employess) dashboard
        else if (request.role_id === 2 || request.role_id === 5) {
            const [err1, data1] = await this.getadminAllEmpsDasboardOverview(request)
            error = err1
            responseData = data1
            //role_id = 4 for lead , get lead (my team) dashboard
        } else if (request.role_id === 4) {
            const [err1, data1] = await this.getleadMyTeamDasboardOverview(request)
            error = err1
            responseData = data1
        }
        return [error, responseData]

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

    this.getReportSummary = async function (request) {
        if (request.role_id == 3) {
            let responseData = [],
                error = true;

            const paramsArr = new Array(
                request.employee_id,
                request.start_date,
                request.end_date,

            );

            const queryString = util.getQueryString('v1_timetracking_timeline_worked_hours_calculation', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        const [err1, data1] = await this.getFilterReportSummary(request, data)

                        responseData = data1;
                        error = err1
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }
        } else if (request.role_id == 4) {
            let responseData = [],
                error = true;
            flag = 2
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                flag
            );

            const queryString = util.getQueryString('reports_get_summary', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        console.log('=======startung===========')
                        console.log(data)
                        console.log('====================================')
                        const [err1, data1] = await this.getTopProjectBasedOnHrs(request)
                        const [err2, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        let totalTime = data2[0].weekHours
                        let topProject = data1[0].project_name
                        let topClient = data1[0].client_name
                        let color_code = data1[0].project_color_code
                        let project_code = data1[0].project_code
                        data.unshift({ totalTime, topProject, topClient, color_code, project_code })
                        responseData = data;
                        error = false

                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }


        } else if (request.role_id == 2) {
            let responseData = [],
                error = true;
            flag = 3
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                flag
            );

            const queryString = util.getQueryString('reports_get_summary', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        //flag =1 for individual user
                        flag = 3
                        const [err1, data1] = await this.getTopProjectBasedOnHrs(request, flag)
                        const [err2, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request, flag)
                        let totalTime = data2[0].weekHours
                        let topProject = data1[0].project_name
                        let topClient = data1[0].client_name
                        let color_code = data1[0].project_color_code
                        let project_code = data1[0].project_code
                        data.unshift({ totalTime, topProject, topClient, color_code, project_code })
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

    this.getReportDetailed = async function (request) {
        if (request.role_id == 3) {
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                1
            );

            const queryString = util.getQueryString('reports_get_detailed', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        console.log('====================================')
                        console.log(data)
                        console.log('====================================')
                        flag = 1
                        const [err1, data1] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request, flag)
                        let totalTime = data1[0].weekHours
                        data.unshift({ totalTime })
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
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                2
            );

            const queryString = util.getQueryString('reports_get_detailed', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        console.log('=======lead===============');
                        console.log(data);
                        console.log('====================================');

                        const [err1, data1] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        let totalTime = data1[0].weekHours
                        data.unshift({ totalTime })
                        responseData = data;
                        error = false

                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }


        } else if (request.role_id == 2) {


            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                3
            );

            const queryString = util.getQueryString('reports_get_detailed', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        console.log('==========LENGTH====')
                        console.log(data.length)
                        console.log('====================================')
                        const [err1, data1] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        let totalTime = data1[0].weekHours
                        data.unshift({ totalTime })
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

    this.getReportWeekly = async function (request) {
        if (request.role_id == 3) {
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                1
            );

            const queryString = util.getQueryString('reports_get_weekly', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        const [err2, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
                        const [err1, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        data.filter(function (o1, i) {
                            data1.some(function (o2) {
                                if (o1.project_id === o2.project_id) {
                                    data[i].total_hour = o2.total_hours
                                }
                            });
                        });
                        let totalTime = data2[0].weekHours
                        data.unshift({ totalTime })
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
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                2
            );

            const queryString = util.getQueryString('reports_get_weekly', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        const [err2, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
                        const [err1, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        data.filter(function (o1, i) {
                            data1.some(function (o2) {
                                if (o1.project_id === o2.project_id) {
                                    data[i].total_hour = o2.total_hours
                                }
                            });
                        });
                        let totalTime = data2[0].weekHours
                        data.unshift({ totalTime })
                        responseData = data;
                        error = false

                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }
        } else if (request.role_id == 2) {
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.first_week_day,
                request.last_week_day,
                request.employee_id,
                3
            );

            const queryString = util.getQueryString('reports_get_weekly', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        const [err2, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
                        const [err1, data2] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        data.filter(function (o1, i) {
                            data1.some(function (o2) {
                                if (o1.project_id === o2.project_id) {
                                    data[i].total_hour = o2.total_hours
                                }
                            });
                        });
                        let totalTime = data2[0].weekHours
                        data.unshift({ totalTime })
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
        project_id = request.project_id
        tag_id = request.tag_id
        status_id = request.status_id


        if (client_id == [] && project_id == [] && tag_id == [] && status_id == []) {
            console.log('====================================')
            console.log("entered all empty")
            console.log('====================================')
            // data = data
            return [false, data]

        } else if (client_id != [] && project_id != [] && tag_id != [] && status_id != []) {
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
            console.log('====================================')

            if (client_id == []) {
                filterClient1 = data
            } else if (client_id != []) {
                for (let i = 0; i < client_id.length; i++) {
                    data.filter(function (data) {
                        if (data.client_id == client_id[i]) {
                            filterClients1.push(data)
                        }
                    })
                }
            } else if (project_id == []) {
                filterProject1 = filterClient1
            } else if (project_id != []) {
                for (let i = 0; i < project_id.length; i++) {
                    filterClient1.filter(function (data) {
                        if (data.project_id == project_id[i]) {
                            filterProject1.push(data)
                        }
                    })
                }
            } else if (tag_id == []) {
                filterTag1 = filterProject1
            } else if (tag_id != []) {
                for (let i = 0; i < tag_id.length; i++) {
                    filterProject1.filter(function (data) {
                        if (data.tag_id == tag_id[i]) {
                            filterTags1.push(data)
                        }
                    })
                }
            } else if (status_id == []) {
                filterStatus1 = filterTags1
            } else if (status_id != []) {
                for (let i = 0; i < status_id.length; i++) {
                    filterTags1.filter(function (data) {
                        if (data.status_id == status_id[i]) {
                            filterStatus1.push(data)
                        }
                    })
                }
            }
            data = filterStatus1
            return [false, data]

        }




    }






}



module.exports = AnalyzeServices;
