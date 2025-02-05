
const Validations = require('../utils/validations')
const moment = require('moment')
const EmployeeService = require('./employeeService')
const LeadService = require('./leadService')
const ProjectBasedApprovalServices = require('./projectbasedapprovalServices')


function TimeTrackingService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)
    const employeeService = new EmployeeService(objectCollection)
    const leadService = new LeadService(objectCollection)
    const projectBasedApprovalServices = new ProjectBasedApprovalServices(objectCollection)

    this.timetrackingAddTaskDetailsInsert = async function (request) {
        let responseData = [],
            error = true;
        const [err, respData] = await validations.taskCreationInputValidation(request);
        if (err) {
            error = err
            responseData = respData
        }
        else {
            const [err, data] = await this.timetrackingGetAllTaskDetailsByDate(request)
            if (data.length == 0) {
                let responseData = [],
                    error = true;
                const paramsArr = new Array(
                    util.getRandomNumericId(),
                    request.task_description,
                    request.project_id,
                    request.employee_id,
                    request.task_start_time,
                    request.task_end_time,
                    await util.getTimeDiff(request),
                    request.task_created_datetime,
                    await util.getFirstWeekDate(request.task_created_datetime),
                    await util.getLastWeekDate(request.task_created_datetime),
                    await util.getWeekName(request),
                    5,
                    util.getCurrentUTCTime()
                );
                const queryString = util.getQueryString('timetracking_add_task_detail_insert', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(1, queryString, request)
                        .then(async (data1) => {
                            if (data1[0].message === "failure") {
                                error = true
                                responseData = [{ message: "Time entries cannot be added once the timesheet is approved by the lead" }];
                            } else if (data1[0].message === "success") {
                                await this.timesheetAddUpdateRemoveProjects(request)
                                await this.addUpdateRemoveUnsubmit(request)
                                error = false,
                                    responseData = [{ message: "TimeEntry has beed added successfully" }];
                            }
                        }).catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData];
                }
            } else {
                const paramsArr = new Array(
                    data[0].task_parent_id,
                    request.task_description,
                    request.project_id,
                    request.employee_id,
                    request.task_start_time,
                    request.task_end_time,
                    await util.getTimeDiff(request),
                    data[0].task_created_datetime,
                    await util.getFirstWeekDate(request.task_created_datetime),
                    await util.getLastWeekDate(request.task_created_datetime),
                    await util.getWeekName(request),
                    5,
                    util.getCurrentUTCTime()
                );
                const queryString = util.getQueryString('timetracking_add_task_detail_insert', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(1, queryString, request)
                        .then(async (data2) => {
                            if (data2[0].message === "failure") {
                                error = true
                                responseData = [{ message: "TimeEntry cannot be added,after submition for approval to lead and once approved from lead" }];
                            } else if (data2[0].message === "success") {
                                await this.timesheetAddUpdateRemoveProjects(request)
                                await this.addUpdateRemoveUnsubmit(request)
                                responseData = [{ message: "TimeEntry has beed added successfully" }];
                                error = false
                            }
                        }).catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData];
                }
            }
        }
        return [error, responseData];
    };

    this.timetrackingUpdateTaskDetails = async function (request) {
        let responseData = [],
            error = true,
            pending=0;
        if (request.status_name == "APPROVED") {
            error = true
            responseData = [{ message: "Time entries cannot be updated once the timesheet is approved by lead" }];
        } else {
            const [err, respData] = await validations.taskCreationInputValidation(request);
            if (err) {
                error = err
                responseData = respData
            } else {
                if(request.status_name.toUpperCase() == "PENDING"){
                    await projectBasedApprovalServices.getProjectWiseTaskDetails(request)
                }
                const [err1, data2] = await this.timetrackingGetChildTask(request)
                let responseData = [],
                    error = true;
                const paramsArr = new Array(
                    request.task_parent_id,
                    request.task_child_id,
                    request.task_description,
                    request.project_id,
                    request.employee_id,
                    request.task_start_time,
                    request.task_end_time,
                    await util.getTimeDiff(request),
                    request.task_created_datetime,
                    await util.getFirstWeekDate(request.task_created_datetime),
                    await util.getLastWeekDate(request.task_created_datetime),
                    await util.getWeekName(request),
                    util.getCurrentUTCTime()
                );


                const queryString = util.getQueryString('timetracking_update_task_details', paramsArr);

                if (queryString !== '') {
                    await db.executeQuery(1, queryString, request)
                        .then(async (data1) => {
                            if (data1[0].message === "failure") {
                                error = true
                                responseData = [{ message: "Time entries cannot be updated once the timesheet is approved by lead" }];
                            } else if (data1[0].message === "success") {
                                await this.timesheetAddUpdateRemoveProjects(request)


                                let request1 = {}
                                request1.project_id = data2[0].project_id
                                request1.employee_id = data2[0].employee_id
                                request1.task_created_datetime = data2[0].task_created_datetime
                                request1.first_week_day = data2[0].first_week_day
                                request1.last_week_day = data2[0].last_week_day
                                request1.week_name = await util.getWeekName(request1)
                                // request1.role_id = 3

                                await this.timesheetAddUpdateRemoveProjects(request1)
                                const [err1, data1] = await this.getWorkedHoursOfAllTasksWeekly(request1)

                                if (data1[0].weekHours == null) {
                                    await this.removeUnsubmited(request1)
                                    await this.addUpdateRemoveUnsubmit(request)
                                } else {
                                    await this.addUpdateRemoveUnsubmit(request)
                                    request.task_created_datetime = data2[0].task_created_datetime
                                    await this.addUpdateRemoveUnsubmit(request)
                                }
                                error = false,
                                    responseData = [{ message: "TimeEntry has beed updated successfully" }];
                            }
                        }).catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData];
                }
            }
        }
        return [error, responseData];

    };

    this.timetrackingRemoveChildTaskDelete = async function (request) {
        let responseData = [],
            error = true;

        const [err, data1] = await this.timetrackingGetChildTask(request)
        const paramsArr = new Array(
            request.task_parent_id,
            request.task_child_id,
            request.employee_id,
        );

        const queryString = util.getQueryString('timetracking_remove_child_task_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data2) => {
                    if (data2[0].message === "failure") {
                        error = true
                        responseData = [{ message: "TimeEntry cannot be deleted,after submition for approval to lead and once approved from lead" }];
                    } else {
                        request.task_created_datetime = data1[0].task_created_datetime
                        request.employee_id = data1[0].employee_id
                        request.project_id = data1[0].project_id
                        await this.timesheetAddUpdateRemoveProjects(request)

                        const firstWeekDate = await util.getFirstWeekDate(data1[0].task_created_datetime)
                        const lastWeekDate = await util.getLastWeekDate(data1[0].task_created_datetime)
                        request.first_week_day = firstWeekDate
                        request.last_week_day = lastWeekDate
                        request.week_name = await util.getWeekName(request)
                        const [err1, data2] = await this.getWorkedHoursOfAllTasksWeekly(request)
                        if (data2[0].weekHours == null) {
                            await this.removeUnsubmited(request)
                        } else {
                            await this.addUpdateRemoveUnsubmit(request)
                        }
                        error = false
                        responseData = [{ message: "TimeEntry has been deleted" }];

                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    };

    this.timesheetAddUpdateRemoveProjects = async function (request) {

        let responseData = []
        error = true
        request.first_Week_Day = await util.getFirstWeekDate(request.task_created_datetime)
        request.last_Week_Day = await util.getLastWeekDate(request.task_created_datetime)
        request.week_name = await util.getWeekName(request)

        const [err, prjData] = await this.getProjectFromTimesheet(request)
        if (prjData.length == 0) {
            const [err, data] = await this.getTimesheetOfAllProjectsOverview(request)
            console.log(data)
            const paramsArr = new Array(
                request.employee_id,
                request.project_id,
                data[0].value[0].hours,
                data[0].value[1].hours,
                data[0].value[2].hours,
                data[0].value[3].hours,
                data[0].value[4].hours,
                data[0].value[5].hours,
                data[0].value[6].hours,
                request.first_Week_Day,
                request.last_Week_Day,
                request.week_name,
                5,
                util.getCurrentUTCTime()
            );
            const queryString = util.getQueryString('timesheet_add_projects_insert', paramsArr);
            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data1) => {
                        error = false
                        responseData = data1
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
            }
        } else {
            const [err, data] = await this.getTimesheetOfAllProjectsOverview(request)
            if (data.length == 0) {
                await this.removeProjectFromTimesheet(request);
            }
            else {  //
                const paramsArr = new Array(
                    request.employee_id,
                    request.project_id,
                    data[0].value[0].hours,
                    data[0].value[1].hours,
                    data[0].value[2].hours,
                    data[0].value[3].hours,
                    data[0].value[4].hours,
                    data[0].value[5].hours,
                    data[0].value[6].hours,
                    request.first_Week_Day,
                    request.last_Week_Day
                );
                const queryString = util.getQueryString('timesheet_update_project', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(1, queryString, request)
                        .then(async (data1) => {
                            error = false
                            responseData = data1
                        }).catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                }
            }
        }
    };

    this.timetrackingGetAllTaskDetailsByDate = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.task_created_datetime
        );

        const queryString = util.getQueryString('timetracking_get_task_details_by_empid_and_date', paramsArr);

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

    this.getAllTasksPerDay = async function (date, request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            date,
            request.employee_id
        );

        const queryString = util.getQueryString('timetracking_get_all_tasks_in_day_select', paramsArr);

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

    this.getAllWeeksByEmpId = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = await util.getQueryString('timetracking_get_all_weeks_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                    console.log('=============timetracking_get_all_weeks_select==================');
                    console.log(responseData);
                    console.log('====================================');
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getAllTasksInThatWeeks = async function (request, data) {
        let responseData = [],
            error = true;

        let isApp = {}
        let eachWeek = []
        let child = []
        let header = {}
        let headObj = {}
        let arrObj = []

        const paramsArr = new Array(
            data.firstWeekDay,
            data.lastWeekDay,
            request.employee_id,
        );

        const queryString = util.getQueryString('timetracking_get_all_tasks_in_Week_select', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data1) => {
                    request.first_week_day = data1[0].first_week_day
                    request.last_week_day = data1[0].last_week_day
                    const start = new Date(data1[0].first_week_day);
                    const end = new Date(data1[0].last_week_day);
                    // request.role_id = 3
                    const [err1, weekhour] = await this.getWorkedHoursOfAllTasksWeekly(request)
                    isApp.startDate = util.getMonthName(data1[0].first_week_day)
                    isApp.endDate = util.getMonthName(data1[0].last_week_day)
                    isApp.weekHour = weekhour[0].weekHours
                    isApp.status = weekhour[0].status_name
                    let loop = new Date(end);
                    //looping thw days in week
                    while (loop >= start) {
                        let date = moment.utc(loop).format("YYYY-MM-DD")
                        const [err, data2] = await this.getAllTasksPerDay(date, request)
                        if (data2.length != 0) {
                            let hours = await util.SumOfMultipleTimeDuration(data2)
                            formatDate = data2[0].date.split(',')
                            month = formatDate[1]
                            day = formatDate[0]
                            hours = hours
                            header = { month, day, hours }
                            child = data2
                            arrObj.push({ header, child })
                            headObj.head = arrObj
                        }

                        let newDate = loop.setDate(loop.getDate() - 1);
                        loop = new Date(newDate)
                    }
                    headObj.head = arrObj
                    eachWeek.unshift({ isApp, ...headObj })
                    responseData = eachWeek;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        };
    }

    this.getAllTasksOfAllWeeksByEmpId = async function (request) {
        let responseData = [],
        error = true;

        const [err, data] = await this.getAllWeeksByEmpId(request)
        console.log('=============getAllWeeksByEmpId================');
        console.log(data);
        console.log('====================================');
        if (!err) {
            if (!data.length == 0) {
                for (let i = 0; i < data.length; i++) {
                    const [err, data1] = await this.getAllTasksInThatWeeks(request, data[i])
                    if (data1.length != 0) {
                        error = false
                        responseData.push(data1)
                    }
                }
            }
            else {
                error = err
                responseData = data
            }
            return [error, responseData];
        }
        return [error, responseData];


    };

    this.timetrackingGetChildTask = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.task_parent_id,
            request.task_child_id,
            request.employee_id,
        );

        const queryString = util.getQueryString('timetracking_get_child_task', paramsArr);

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

    this.statusAddinsert = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.status_name,
            util.getCurrentUTCTime()
        );


        const queryString = util.getQueryString('status_add_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data2) => {
                    console.log(data2)
                    responseData = data2;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];

        }

    };

    this.getTimesheetOfAllProjectsOverview = async function (request) {
        let responseData = [],
            error = true;
        //flag =1 for total worked hours calculation for each project for each day
        flag = 1
        const paramsArr = new Array(
            request.first_Week_Day,
            request.last_Week_Day,
            request.employee_id,
            request.project_id,
            flag
        );

        const queryString = util.getQueryString('timetracking_timeline_worked_hours_calculation', paramsArr);
console.log(queryString)
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log(data,"data")
                    var newArray = data.reduce(function (acc, curr) {
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

                    let arr1 = ["mon", 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
                    for (let i = 0; i < newArray.length; i++) {
                        arr1.map((va) => {
                            let aaa = newArray[i]?.value.some((el) => (el.day).toLowerCase() === va)
                            if (!aaa) {
                                newArray[i].value.push({
                                    hours: '00:00:00',
                                    day: va,
                                })
                            }
                        })
                    }
                    const sorter = {
                        "mon": 1,
                        "tue": 2,
                        "wed": 3,
                        "thu": 4,
                        "fri": 5,
                        "sat": 6,
                        "sun": 7
                    }
                    for (let j = 0; j < newArray.length; j++) {
                        newArray[j].value.sort(function sortByDay(a, b) {

                            let day1 = a.day.toLowerCase();
                            let day2 = b.day.toLowerCase();
                            return sorter[day1] - sorter[day2];
                        });
                    }
                    responseData = newArray;
                    console.log(newArray,"nnnnnnn")
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })

            return [error, responseData];
        }


    };

    this.getWorkedHrsOfEachPrjInWeek = async function (request) {
        let responseData = [],
            error = true;
        //flag =2 for total hours worked for each project in a week
        flag = 2
        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            request.employee_id,
            0,
            2
        );

        const queryString = util.getQueryString('timetracking_timeline_worked_hours_calculation', paramsArr);

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

    this.getWorkedHrsOfAllPrjsInDay = async function (request) {
        let responseData = [],
            error = true;

        //  flag =5 total worked hours of all projects for each day for a week
        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            request.employee_id,
            0,
            5
        );

        const queryString = util.getQueryString('timetracking_timeline_worked_hours_calculation', paramsArr);

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

    }

    this.getWorkedHoursOfAllTasksWeekly = async function (request) {
        let responseData = [],
            error = true;
        //flag =4 for total hours calculation for all projects for a given week 
        flag = 4
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


    };

    this.getAllProjectsTimesheetWeekly = async function (request) {
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
                    if (!data.length == 0) {
                        flag = 1
                        // request.role_id = 3
                        const [err1, data1] = await this.getWorkedHrsOfEachPrjInWeek(request, flag)
                        const [err2, data2] = await this.getWorkedHrsOfAllPrjsInDay(request, flag)

                        data.filter(function (o1, i) {
                            data1.some(function (o2) {
                                if (o1.project_id === o2.project_id) {
                                    data[i].total_hour = o2.total_hours
                                }
                            });
                        });

                        //sort projects alphabetically in aesc
                        await data.sort(function (a, b) {
                            return a.project_name.localeCompare(b.project_name);
                        })

                        //renaming object key and calculating total time
                        for (let i = 0; i < data1.length; i++) {
                            data1[i].task_total_time = data1[i].total_hours
                            delete data1[i].total_hour
                        }
                        let total = await util.sumOfTime(data1)

                        data2[0].total_hour = total
                        data.push(data2[0])
                        responseData = data;
                        error = false
                    } else {
                        responseData = data;
                        error = false
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getAllProjectsTeamTimesheetWeekly = async function (request) {
        let responseData = [],
            error = false;
        let weeks = await util.getWeeks(request)
        for (let dates of weeks) {
            const paramsArr = new Array(
                request.employee_id,
                dates[0],
                dates[1],
                request.role_id
            );
            let [err, response] = await this.getAllProjectsTeamTimesheetWeeklyData(request, paramsArr)
            let starDate = await util.getMonthName(dates[0]);
            let endDate = await util.getMonthName(dates[1]);

            for (let res of response) {
                res.first_week_day = dates[0],
                    res.last_week_day = dates[1]
            }
            responseData.push({
                "week": `${starDate}-${endDate}`,
                "first_week_day": dates[0],
                "last_week_day": dates[1],
                "data": response
            })
        }
        return [error, responseData];
    }


    this.getAllProjectsTeamTimesheetWeeklyData = async function (request, paramsArr) {
        let responseData = [],
            error = true;

        const queryString = util.getQueryString('team_timesheet_get_all_projects_worked_hours_weekly', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data.length > 0) {
                        responseData = data;
                        error = false
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    };


    this.getProjectFromTimesheet = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.project_id,
            request.first_Week_Day,
            request.last_Week_Day
        );

        const queryString = util.getQueryString('timesheet_get_projects', paramsArr);

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

    this.removeProjectFromTimesheet = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.project_id,
            request.first_Week_Day,
            request.last_Week_Day
        );

        const queryString = util.getQueryString('timesheet_remove_Project_delete', paramsArr);

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




    //----------------------approvals services------------------

    this.addUpdateRemoveUnsubmit = async function (request) {
        let responseData = [],
            error = true;
        const [err2, data2] = await this.getUnsubmited(request)
        if (data2.length == 0) {
            const [err, data] = await this.getEmployeeLead(request)
            const first_week_day = await util.getFirstWeekDate(request.task_created_datetime)
            const last_week_day = await util.getLastWeekDate(request.task_created_datetime)
            const firstMonth = await util.getMonthName(first_week_day)
            const lastMonth = await util.getMonthName(last_week_day)
            request.first_week_day = first_week_day
            request.last_week_day = last_week_day
            const [err1, data1] = await this.getWorkedHoursOfAllTasksWeekly(request)

            //flag 1 for insert into unsubmited
            const paramsArr = new Array(
                data[0].employee_id,
                request.employee_id,
                data1[0].weekHours,
                first_week_day,
                last_week_day,
                firstMonth.concat("-" + lastMonth),
                2,
                1
            );

            const queryString = util.getQueryString('approvals_add_update_remove_unsubmit', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        responseData = data;
                        error = false
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
            }
            return [error, responseData];
        } else {
            const [err, data] = await this.getEmployeeLead(request)
            const first_week_day = await util.getFirstWeekDate(request.task_created_datetime)
            const last_week_day = await util.getLastWeekDate(request.task_created_datetime)
            const firstMonth = await util.getMonthName(first_week_day)
            const lastMonth = await util.getMonthName(last_week_day)
            request.first_week_day = first_week_day
            request.last_week_day = last_week_day
            const [err1, data1] = await this.getWorkedHoursOfAllTasksWeekly(request)
            //flag 2 for update into unsubmited

            const paramsArr = new Array(
                data[0].employee_id,
                request.employee_id,
                data1[0].weekHours,
                first_week_day,
                last_week_day,
                firstMonth.concat("-" + lastMonth),
                2,
                2
            );

            const queryString = util.getQueryString('approvals_add_update_remove_unsubmit', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        responseData = data;
                        error = false
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
            }
            return [error, responseData];

        }

    }

    this.addInApprovalsOnRejectAfterApprove = async function (request) {
        let responseData = [],
            error = true;

        const [err, data] = await this.getEmployeeLead(request)
        const first_week_day = await util.getFirstWeekDate(request.task_created_datetime)
        const last_week_day = await util.getLastWeekDate(request.task_created_datetime)
        const firstMonth = await util.getMonthName(first_week_day)
        const lastMonth = await util.getMonthName(last_week_day)
        request.first_week_day = first_week_day
        request.last_week_day = last_week_day
        const [err1, data1] = await this.getWorkedHoursOfAllTasksWeekly(request)

        //flag 1  insert into unsubmited

        const paramsArr = new Array(
            data[0].employee_id,
            request.employee_id,
            data1[0].weekHours,
            first_week_day,
            last_week_day,
            firstMonth.concat("-" + lastMonth),
            0,
            1
        );

        const queryString = util.getQueryString('approvals_add_update_remove_unsubmit', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
        }
        return [error, responseData];
    }

    this.getUnsubmited = async function (request) {
        let responseData = [],
            error = true;

        const [err, data] = await this.getEmployeeLead(request)
        const first_week_day = await util.getFirstWeekDate(request.task_created_datetime)
        const last_week_day = await util.getLastWeekDate(request.task_created_datetime)
        const firstMonth = util.getMonthName(first_week_day)
        const lastMonth = util.getMonthName(last_week_day)


        //flag 3  get unsubmitted

        const paramsArr = new Array(
            data[0].employee_id,
            request.employee_id,
            0,
            first_week_day,
            last_week_day,
            firstMonth.concat("-" + lastMonth),
            2,
            3
        );
        const queryString = util.getQueryString('approvals_add_update_remove_unsubmit', paramsArr);
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

    this.removeUnsubmited = async function (request) {
        let responseData = [],
            error = true;
        const [err, data] = await this.getEmployeeLead(request)

        //flag 4 remove unsubmitted

        const paramsArr = new Array(
            data[0].employee_id,
            request.employee_id,
            0,
            request.first_week_day,
            request.last_week_day,
            request.week_name,
            2,
            4
        );

        const queryString = util.getQueryString('approvals_add_update_remove_unsubmit', paramsArr);

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

    this.getEmployeeLead = async function (request) {
        let responseData = [],
            error = true;
        let id = request.employee_id ? request.employee_id : request.team_member_employee_id;
        request.employee_id = id;
        const paramsArr = new Array(
            request.employee_id.toString()
        );
        const queryString = util.getQueryString('employee_get_lead_by_empid', paramsArr);

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

    this.getApprovalsList = async function (request) {
        let responseData = []
        error = true;

        let data1 = []
        let empsGathered = []

        if (request.role_id == 2) {
            if (request.employees.length != 0 || request.groups.length != 0) {
                let employees = request.employees
                let groups = request.groups

                if (employees.length != 0) {
                    for (let i = 0; i < employees.length; i++) {
                        request.employee_id = employees[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (groups.length != 0) {
                    for (let i = 0; i < groups.length; i++) {
                        request.employee_id = groups[i]
                        const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 1)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess
                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const [err8, data8] = await employeeService.getAllEmployees(request)
                data1 = data8
            }

        } else if (request.role_id == 3) {
            const [err9, data9] = await employeeService.getEmployeeById(request)
            data1 = data9
        } else {
            if (request.employees.length != 0 || request.groups.length != 0) {

                if (request.employees.length != 0) {
                    let employees = request.employees
                    for (let i = 0; i < employees.length; i++) {
                        request.employee_id = employees[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    let groups = request.groups
                    for (let i = 0; i < groups.length; i++) {
                        request.employee_id = groups[i]
                        const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 1)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess
                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 1)
                data1 = data9
            }
        }
        if (data1.length != 0) {
            const f = request.first_week_day
            const l = request.last_week_day
            for (let i = 0; i < data1.length; i++) {
                request.first_week_day = f
                request.last_week_day = l
                const [err, data2] = await this.getListFromApprovals(request, data1[i])
                if (data2.length != 0) {
                    for (let j = 0; j < data2.length; j++) {
                        request.employee_id = data2[j].team_member_employee_id
                        request.first_week_day = data2[j].first_week_day
                        request.last_week_day = data2[j].last_week_day
                        const [error11, data11] = await this.getSubmittedApproveEntries(request, 1)
                        const [error22, data22] = await this.getSubmittedApproveEntries(request, 2)
                        if (data2[j].status_id == 1) {
                            data2[j].submitted_datetime = data11[0].submited_for_approval_datetime
                            data2[j].approved_datetime = null
                            data2[j].approved_by = null
                        } else if (data2[j].status_id == 3) {
                            data2[j].approved_datetime = data22[0].approved_on_datetime
                            data2[j].approved_by = data22[0].approved_by
                            data2[j].submitted_datetime = data11[0].submited_for_approval_datetime
                        } else if (data2[j].status_id == 2) {
                            data2[j].submitted_datetime = null
                            data2[j].approved_datetime = null
                            data2[j].approved_by = null
                        }
                        responseData.push(data2[j])
                        error = false
                    }
                } else
                    error = false
            }
            return [error, responseData];
        }
    }

    this.getListFromApprovals = async function (request, data) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            data.employee_id,
            0,
            request.first_week_day,
            request.last_week_day,
        )

        const queryString = util.getQueryString('approvals_get_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err

                })

        }
        return [error, responseData];
    }

    this.getSubmittedApproveEntries = async function (request, flag) {

        let responseData = [],
            error = true;

        //if flag =1 get submited_for_approval_datetime of emp 
        //if flag =2 get  approved_on_datetime of emp 

        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            flag
        );
        const queryString = util.getQueryString('approvals_get_entries_date', paramsArr);

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

    this.onApprovedChangeStatus = async function (request) {
        let responseData = [],
            error = true;
        //flag=2 on approve change status to approve(archieve) 
        flag = 2
        let id = request.employee_id ? request.employee_id : request.team_member_employee_id;
        request.employee_id = id;
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            flag
        );
        const queryString = util.getQueryString('approvals_change_status', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    const [err1, data1] = await this.onApprovedEntry(request)
                    responseData = data1;
                    error = err1
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.onSubmitForApproval = async function (request) {
        let responseData = [],
            error = true;
        const [err2, res] = await this.getEmployeeWeeklyTimetrackingTaskDetails(request);
        if (err2) {
            error = err2
            responseData = res
            return [error, responseData];
        }
        else {
            if (res.length === 0) {
                //flag=1 on submit for approval change status to pending 
                flag = 1
                let id = request.employee_id ? request.employee_id : request.team_member_employee_id;
                request.employee_id = id;
                const paramsArr = new Array(
                    request.employee_id,
                    request.first_week_day,
                    request.last_week_day,
                    flag
                );
                const queryString = util.getQueryString('approvals_change_status', paramsArr);

                if (queryString !== '') {
                    await db.executeQuery(1, queryString, request)
                        .then(async (data) => {
                            if (data[0].message == "success") {
                                const [err1, data1] = await this.onSubmitForApprovalEntry(request)
                                await projectBasedApprovalServices.getProjectWiseTaskDetails(request)
                                responseData = data1;
                                error = err1
                            } else {
                                error = true
                                responseData = [{ message: data[0].message }];
                            }
                        }).catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData];
                }
            }

        }

    }

    this.onSubmitForApprovalEntry = async function (request) {
        let responseData = [],
            error = true;
        //flag =1  on submit entry
        flag = 1
        request.task_created_datetime = request.first_week_day
        request.week_name = await util.getWeekName(request)
        let id = request.employee_id ? request.employee_id : request.team_member_employee_id;
        request.employee_id = id;
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            request.week_name,
            util.getCurrentUTCTime(),
            null,
            null,
            null,
            null,
            null,
            null,
            util.getCurrentUTCTime(),
            null,
            flag

        );
        const queryString = util.getQueryString('approvals_approve_reject_submit_withdrawn_entries_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    // const [err1, data1] = await this.getEmployeeProjectLeadByEmpid(request);
                    // const [err2, data2] = await employeeService.getEmployeeById(request)

                    // for(let i of data1){
                    //     request.email = i.email
                    //     request.project_name = i.project_name
                    //     request.employee_name = data2[0].full_name
                    //     await util.nodemailerSenderToLeadOnTimesheetSubmit(request)
                    // }
                   
                    responseData = [{ message: "Timesheet has been submited successfully for approval" }];
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.getEmployeeProjectLeadByEmpid = async function (request) {
        let responseData = [],
            error = true;
       
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
        );
        const queryString = util.getQueryString('employee_get_project_lead_by_empid', paramsArr);

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


    this.onApproved = async function (request) {
        let responseData = [],
            error = true;
        for (let i = 0; i < request.length; i++) {
            await this.onApprovedChangeStatus(request[i])
        }
        error = false
        return [error, responseData];
    }

    this.onApprovedEntry = async function (request) {
        let responseData = [],
            error = true;
        //getting row where to update
        const [err1, data1] = await this.getApproveRejectSubmitEntriesByEmpId(request, 3)
        //flag =2  on approve , reject,withdrawn entry
        flag = 2
        request.task_created_datetime = request.first_week_day
        request.week_name = await util.getWeekName(request)
        let id = request.employee_id ? request.employee_id : request.team_member_employee_id;
        request.employee_id = id;
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            request.week_name,
            data1[0].submited_for_approval_datetime,
            request.lead_id,
            util.getCurrentUTCTime(),
            null,
            null,
            null,
            null,
            util.getCurrentUTCTime(),
            data1[0].sno,
            flag
        );
        const queryString = util.getQueryString('approvals_approve_reject_submit_withdrawn_entries_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    const [err1, data1] = await this.onApprovedSendMail(request)
                    responseData = data1;
                    error = err1
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.onApprovedSendMail = async function (request) {
        let responseData = [],
            error = true;

        const [err1, data1] = await employeeService.getEmployeeById(request)
        request.employee_email = data1[0].email,
            request.employee_name = data1[0].full_name
        request.employee_id = request.lead_id
        const [err2, data2] = await employeeService.getEmployeeById(request)
        request.approved_by = data2[0].full_name
        await util.nodemailerSenderOnApprove(request).then((data) => {
            error = false
            responseData = [{ message: "Approved successfully and mail have been sended to employee" }]
        }).catch((err) => {
            console.log("err-------" + err);
            error = err
        })
        return [error, responseData];

    }

    this.onReject = async function (request) {
        let responseData = [],
            error = true;
        const [err, data] = await validations.addOnRejectValidation(request)
        if (err) {
            responseData = data;
            error = err
        } else {
            //flag=3 on reject change status to unsubmitted  and submit in user
            flag = 3
            const paramsArr = new Array(
                request.employee_id,
                request.first_week_day,
                request.last_week_day,
                flag
            );
            const queryString = util.getQueryString('approvals_change_status', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        if (data[0].message == "success") {
                            const [err1, data1] = await this.onRejectEntry(request)
                            responseData = data1;
                            error = false
                        } else {
                            error = true
                            responseData = [{ message: data[0].message }];
                        }

                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }

        }
        return [error, responseData];

    }

    this.onRejectEntry = async function (request) {

        let responseData = [],
            error = true;
        const [err1, data1] = await this.getApproveRejectSubmitEntriesByEmpId(request, 3)
        if (data1[0].approved_on_datetime == null) {
            //flag =2  on approve and reject entry
            flag = 2
            request.task_created_datetime = request.first_week_day
            request.week_name = await util.getWeekName(request)
            paramsArr = new Array(
                request.employee_id,
                request.first_week_day,
                request.last_week_day,
                request.week_name,
                data1[0].submited_for_approval_datetime,
                null,
                null,
                request.lead_id,
                util.getCurrentUTCTime(),
                request.note,
                null,
                util.getCurrentUTCTime(),
                data1[0].sno,
                flag

            );
        } else {
            //flag =2  on approve , reject,withdrawn entry
            // flag = 2
            request.task_created_datetime = request.first_week_day
            request.week_name = await util.getWeekName(request)
            await this.addInApprovalsOnRejectAfterApprove(request)
            paramsArr = new Array(
                request.employee_id,
                request.first_week_day,
                request.last_week_day,
                request.week_name,
                data1[0].submited_for_approval_datetime,
                data1[0].approved_by_employee_id,
                data1[0].approved_on_datetime,
                request.lead_id,
                util.getCurrentUTCTime(),
                request.note,
                null,
                util.getCurrentUTCTime(),
                data1[0].sno,
                2
            )
        }
        const queryString = util.getQueryString('approvals_approve_reject_submit_withdrawn_entries_insert', paramsArr);

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

        request.employee_id = request.lead_id
        const [err2, data2] = await employeeService.getEmployeeById(request)
        request.rejected_by = data2[0].full_name
        await util.nodemailerSenderOnReject(request).then((data) => {
            error = false
            responseData = [{ message: "rejected successfully and mail have been sended to employee" }]
        }).catch((err) => {
            console.log("err-------" + err);
            error = err
        })
        return [error, responseData];

    }

    this.onWithdraw = async function (request) {
        console.log("------------------------entered onWithdraw--------------------------------");

        let responseData = [],
            error = true;
        // on withdraw change status to pending  and submit in user
        flag = 4
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            flag
        );
        const queryString = util.getQueryString('approvals_change_status', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data[0].message == "success") {
                        const [err1, data1] = await this.onWithdrawnEntry(request)
                        await projectBasedApprovalServices.projectWiseTaskDetailsWithdraw(request)
                        responseData = data1;
                        error = false
                    } else {
                        error = true
                        responseData = [{ message: data[0].message }];
                    }

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.onWithdrawnEntry = async function (request) {
        let responseData = [],
            error = true;
        const [err1, data1] = await this.getApproveRejectSubmitEntriesByEmpId(request, 3)
        //flag =2  on approve , reject,withdrawn entry
        flag = 2
        request.task_created_datetime = request.first_week_day
        request.week_name = await util.getWeekName(request)
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            request.week_name,
            data1[0].submited_for_approval_datetime,
            null,
            null,
            null,
            null,
            null,
            util.getCurrentUTCTime(),
            util.getCurrentUTCTime(),
            data1[0].sno,
            flag

        );
        const queryString = util.getQueryString('approvals_approve_reject_submit_withdrawn_entries_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    await this.getEmployeeLead()
                    responseData = [{ message: "Timesheet has been withdrawn successfully by employee" }];
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.getApproveRejectSubmitEntriesByEmpId = async function (request, flag) {
        let responseData = [],
            error = true;
        request.task_created_datetime = request.first_week_day
        request.week_name = await util.getWeekName(request)
        let id = request.employee_id ? request.employee_id : request.team_member_employee_id;
        request.employee_id = id;
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            flag
        );
        const queryString = util.getQueryString('approvals_get_entries_date', paramsArr);

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

    this.timetrackingSearchByValue = async function (request) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            request.employee_id,
            request.search_value,
        );

        const queryString = util.getQueryString('timetracking_search_by_value', paramsArr);

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

    this.copyLastWeekDataAndInsert = async function (request) {
        let responseData = [],
            error = true,
            first_week_day,
            last_week_day,
            week_name,
            preset_first_week_day,
            preset_last_week_day,
            preset_week_name,
            date,
            previousWeek,
            previousDate;

        date = new Date();

        previousWeek = await util.getPreviousWeek(date);
        previousDate = previousWeek.start;

        first_week_day = await util.getFirstWeekDate(previousDate)
        last_week_day = await util.getLastWeekDate(previousDate)
        week_name = await util.getWeekName_V1(previousDate)

        preset_first_week_day = await util.getFirstWeekDate(date)
        preset_last_week_day = await util.getLastWeekDate(date)
        preset_week_name = await util.getWeekName_V1(date)

        const paramsArr = new Array(
            request.employee_id,
            first_week_day,
            last_week_day,
            week_name,
            preset_first_week_day,
            preset_last_week_day,
            preset_week_name
        );

        const queryString = util.getQueryString('copy_last_week_data_and_insert', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log(data, "data")
                    if (data[0].message === "success") {
                        error = false
                        responseData = [{ message: "Copied last week data successfully" }];
                    } else {
                        error = true,
                            responseData = [{ message: data[0].message }];
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    };

    //get/employee/weekly/timetracking/task/detail
    this.getEmployeeWeeklyTimetrackingTaskDetails = async function (request) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            request.employee_id
        )

        const queryString = util.getQueryString('timetracking_get_all_tasks_in_Week_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    for (part of data) {
                        if (part.task_description.trim() === '.' || part.task_description.trim() === ' ') {
                            error = true;
                            responseData = ([{ message: 'Kindly Please Add The One Of Your Task Description Is Empty' }]);
                        } else {
                            error = false;
                            responseData = []
                        }
                    }
                })
                .catch((err) => {
                    console.log("error-------", err);
                    error = err;
                })
        }
        return [error, responseData];
    }

}



module.exports = TimeTrackingService;
