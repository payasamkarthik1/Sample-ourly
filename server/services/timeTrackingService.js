
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')
const moment = require('moment')
function TimeTrackingService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)


    this.timetrackingAddTaskDetailsInsert = async function (request) {
        const [err, data] = await this.timetrackingGetAllTaskDetailsByDate(request)
        if (data == 0) {
            const firstWeekDate = await util.getFirstWeekDate(request.task_created_datetime)
            const lastWeekDate = await util.getLastWeekDate(request.task_created_datetime)
            const firstMonth = util.getMonthName(firstWeekDate)
            const lastMonth = util.getMonthName(lastWeekDate)

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
                firstMonth.concat(" " + lastMonth),
                util.getCurrentUTCTime()
            );
            const queryString = util.getQueryString('timetracking_add_task_detail_insert', paramsArr);
            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data1) => {
                        await this.timesheetAddUpdateRemoveProjects(request, firstWeekDate, lastWeekDate, firstMonth, lastMonth)
                        error = false,
                            responseData = data1
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }
        } else {
            firstWeekDate = await util.getFirstWeekDate(request.task_created_datetime)
            lastWeekDate = await util.getLastWeekDate(request.task_created_datetime)
            const firstMonth = util.getMonthName(firstWeekDate)
            const lastMonth = util.getMonthName(lastWeekDate)

            let responseData = [],
                error = true;
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
                firstMonth.concat(" " + lastMonth),
                util.getCurrentUTCTime()
            );


            const queryString = util.getQueryString('timetracking_add_task_detail_insert', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data2) => {
                        await this.timesheetAddUpdateRemoveProjects(request, firstWeekDate, lastWeekDate, firstMonth, lastMonth)
                        console.log('==========timetrackingAddTaskDetailsInsert==========')
                        console.log(data2)
                        console.log('====================================')
                        responseData = data2;
                        error = false
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];

            }

        }


    };

    this.timetrackingUpdateTaskDetails = async function (request) {
        const firstWeekDate = await util.getFirstWeekDate(request.task_created_datetime)
        const lastWeekDate = await util.getLastWeekDate(request.task_created_datetime)
        const firstMonth = util.getMonthName(firstWeekDate)
        const lastMonth = util.getMonthName(lastWeekDate)

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
            firstMonth.concat(" " + lastMonth),
            util.getCurrentUTCTime()
        );


        const queryString = util.getQueryString('timetracking_update_task_details', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data1) => {
                    await this.timesheetAddUpdateRemoveProjects(request, firstWeekDate, lastWeekDate, firstMonth, lastMonth)

                    //for update project taking details before of project before update and update in timesheet
                    const firstMonth1 = util.getMonthName(data2[0].first_week_day)
                    const lastMonth1 = util.getMonthName(data2[0].last_week_day)
                    request.project_id = data2[0].project_id
                    await this.timesheetAddUpdateRemoveProjects(request, data2[0].first_week_day, data2[0].last_week_day, firstMonth1, lastMonth1)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
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
        console.log('========ENTERED GET ALL WEEKS==============')
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = util.getQueryString('timetracking_get_all_weeks_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==========getAllWeeksByEmpId=============')
                    console.log(data)
                    console.log('====================================')
                    responseData = data;
                    error = false
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
                    const [err1, weekhour] = await this.getWorkedHoursOfAllTasksWeekly(request)
                    isApp.startDate = util.getMonthName(data1[0].first_week_day)
                    isApp.endDate = util.getMonthName(data1[0].last_week_day)
                    isApp.weekHour = weekhour[0].weekHours
                    isApp.status = "Submit"
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

                            console.log('==========ARRAY OF OBJECT(each day header and child in week)===============')
                            console.log(arrObj)
                            console.log('=================================================================')

                        }

                        let newDate = loop.setDate(loop.getDate() - 1);
                        loop = new Date(newDate)
                    }
                    headObj.head = arrObj

                    eachWeek.unshift({ isApp, ...headObj })
                    console.log('==========EACH WEEK DATA===============')
                    console.log(eachWeek)
                    console.log('====================================')

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
        let responseData = []
        error = true;

        const [err, data] = await this.getAllWeeksByEmpId(request)
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

        }

        return [error, responseData];


    };

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

    this.timetrackingRemoveChildTaskDelete = async function (request) {

        const [err, data] = await this.timetrackingGetChildTask(request)
        const firstWeekDate = await util.getFirstWeekDate(data[0].task_created_datetime)
        const lastWeekDate = await util.getLastWeekDate(data[0].task_created_datetime)
        const firstMonth = util.getMonthName(firstWeekDate)
        const lastMonth = util.getMonthName(lastWeekDate)
        request.employee_id = data[0].employee_id
        request.project_id = data[0].project_id

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.task_parent_id,
            request.task_child_id,
            request.employee_id,
        );

        const queryString = util.getQueryString('timetracking_remove_child_task_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    await this.timesheetAddUpdateRemoveProjects(request, firstWeekDate, lastWeekDate, firstMonth, lastMonth)
                    console.log(data)
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

    this.getTimesheetOfAllProjectsOverview = async function (request, firstWeekDate, lastWeekDate) {
        console.log(firstWeekDate);
        console.log(lastWeekDate);
        let responseData = [],
            error = true;
        //flag =1 for total worked hours calculation for each project for each day
        flag = 1
        const paramsArr = new Array(
            firstWeekDate,
            lastWeekDate,
            request.employee_id,
            request.project_id,
            flag
        );

        const queryString = util.getQueryString('timetracking_timeline_worked_hours_calculation', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
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
                        const [err1, data1] = await this.getWorkedHrsOfEachPrjInWeek(request)
                        const [err2, data2] = await this.getWorkedHrsOfAllPrjsInDay(request)
                        data.push(data2[0])
                        data.filter(function (o1, i) {
                            data1.some(function (o2) {
                                if (o1.project_id === o2.project_id) {
                                    data[i].total_hour = o2.total_hours
                                }
                            });
                        });

                        console.log(data);
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

    this.getProjectFromTimesheet = async function (request, firstWeekDay, lastWeekDay) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.project_id,
            firstWeekDay,
            lastWeekDay
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

    this.removeProjectFromTimesheet = async function (request, firstWeekDay, lastWeekDay) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.project_id,
            firstWeekDay,
            lastWeekDay
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

    this.timesheetAddUpdateRemoveProjects = async function (request, firstWeekDay, lastWeekDay, firstMonth, lastMonth) {

        const [err, prjData] = await this.getProjectFromTimesheet(request, firstWeekDay, lastWeekDay)
        if (prjData.length == 0) {
            const [err, data] = await this.getTimesheetOfAllProjectsOverview(request, firstWeekDay, lastWeekDay)
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
                firstWeekDay,
                lastWeekDay,
                firstMonth.concat(" " + lastMonth),
                util.getCurrentUTCTime()
            );
            const queryString = util.getQueryString('timesheet_add_projects_insert', paramsArr);
            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data1) => {

                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })

            }
        } else {
            const [err, data] = await this.getTimesheetOfAllProjectsOverview(request, firstWeekDay, lastWeekDay)
            if (data.length == 0) {
                await this.removeProjectFromTimesheet(request, firstWeekDay, lastWeekDay);
            }
            else {

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
                    firstWeekDay,
                    lastWeekDay,
                );
                const queryString = util.getQueryString('timesheet_update_project', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(1, queryString, request)
                        .then(async (data1) => {

                        }).catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })

                }
            }
        }
    };



}



module.exports = TimeTrackingService;
