
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')
const moment = require('moment')
function TimeTrackingService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)



    this.timetrackingAddTaskDetailsInsert = async function (request) {
        const [err, data] = await this.timetrackingTaskDetailsGetByEmployeeId(request)
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
                    .then((data1) => {
                        console.log(data1)
                        responseData = data1;
                        error = false
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }
        } else {
            const firstWeekDate = await util.getFirstWeekDate(request.task_created_datetime)
            const lastWeekDate = await util.getLastWeekDate(request.task_created_datetime)
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
                    .then((data2) => {

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
                .then((data1) => {
                    console.log('===========timetrackingUpdateTaskDetails==============')
                    console.log(data1)
                    console.log('====================================')
                    responseData = data1;
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
        console.log('==========ENTERED GET ALL TASKS IN DAY==============')

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
                    console.log('============= getAllTasksPerDay=============')
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
        console.log('========ENTERED GET ALL TASKA IN WEEK==============')
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
            request.employee_id
        );

        const queryString = util.getQueryString('timetracking_get_all_tasks_in_Week_select', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data1) => {

                    s = data1[0].first_week_day
                    l = data1[0].last_week_day
                    const start = new Date(data1[0].first_week_day);
                    const end = new Date(data1[0].last_week_day);

                    const [err1, weekhour] = await this.getAllTaskWeekHour(s, l, request)
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

    this.getAllWeeksTasksByEmpId = async function (request) {
        let responseData = []
        error = true;

        const [err, data] = await this.getAllWeeksByEmpId(request)
        if (!err) {

            for (let i = 0; i < data.length; i++) {
                const [err, data1] = await this.getAllTasksInThatWeeks(request, data[i])
                if (data1.length != 0) {
                    error = false
                    responseData.push(data1)
                }
            }

        }

        return [error, responseData];


    };

    this.getAllTaskWeekHour = async function (start, end, request) {
        console.log('==========enter GET ALL TASK WEEK HOUR==============')
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            start,
            end,
            request.employee_id
        );

        const queryString = util.getQueryString('timetracking_get_all_tasks_total_week_hour', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==========getAllTaskWeekHour=============')
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

    this.timetrackingGetChildTaskByid = async function (request) {


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

    this.timetrackingRemoveChildTaskDelete = async function (request) {


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
                .then((data) => {
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



    this.timesheetAddStatusinsert = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.timesheet_status_name,
            util.getCurrentUTCTime()
        );


        const queryString = util.getQueryString('timesheet_add_status_insert', paramsArr);

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


    this.getTimesheetWeeklyTasks = async function (request) {
        let responseData = [],
            error = true;
        let obj = {}

        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            request.employee_id
        );

        const queryString = util.getQueryString('timesheet_get_all_tasks_weekly', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==========getTimesheetWeeklyTasks=============')
                    // console.log(data[0])
                    for (let i = 0; i < data.length; i++) {
                        let key = data[i].project_id;
                        for (let j = i + 1; j < data.length; j++) {
                            if (data[j].project_id == key) {
                                // {...obj1, ...obj2}
                                Object.assign(data[i], data[j]);
                                // data[i] = {...data[i], ...data[j]};
                                // delete data.splice(j,1);
                            }

                        }
                    }

                    console.log('====================================')
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


}



module.exports = TimeTrackingService;
