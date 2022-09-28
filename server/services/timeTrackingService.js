
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')
const moment = require('moment')
function TimeTrackingService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)



    this.timetrackingTaskDetailsInsert = async function (request) {
        const [err, data] = await this.timetrackingTaskDetailsGetByEmployeeId(request)
        if (data == 0) {
            const f = await util.getFirstWeekDate(request.task_created_datetime)
            const l = await util.getLastWeekDate(request.task_created_datetime)
            const fir = util.getMonthName(f)
            const sec = util.getMonthName(l)


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
                fir.concat(" " + sec),
                util.getCurrentUTCTime()
            );


            const queryString = util.getQueryString('timetracking_add_task_detail_insert', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then((data1) => {
                        console.log('====================================')
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
        } else {
            const f = await util.getFirstWeekDate(request.task_created_datetime)
            const l = await util.getLastWeekDate(request.task_created_datetime)
            const fir = util.getMonthName(f)
            const sec = util.getMonthName(l)
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                data[0].task_id,
                request.task_description,
                request.project_id,
                request.employee_id,
                request.task_start_time,
                request.task_end_time,
                await util.getTimeDiff(request),
                data[0].task_created_datetime,
                await util.getFirstWeekDate(request.task_created_datetime),
                await util.getLastWeekDate(request.task_created_datetime),
                fir.concat(" " + sec),
                util.getCurrentUTCTime()
            );


            const queryString = util.getQueryString('timetracking_add_task_detail_insert', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then((data2) => {
                        console.log('====================================')
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
            request.employee_id,
            request.task_created_datetime
        );

        const queryString = util.getQueryString('timetracking_task_details_emp_get_by_date', paramsArr);

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


        const queryString = util.getQueryString('timetracking_task_details_emp_get_by_date', paramsArr);

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

    this.timetrackingTaskDetailsGetByEmployeeIdByDate = async function (request) {


        // this.timetrackingTaskDetailsGetByEmployeeIdByDate(request)
        let result = []
        let data1 = []
        let child = []
        let header = {}
        let isApp = {}

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id,
            request.date
        );

        const queryString = util.getQueryString('timetracking_get_task_detail_by_empid_by_date', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                    isApp.firstDay = data[0].task_first_week_day
                    isApp.lastDay = data[0].task_last_week_day
                    result.isApp = isApp
                    result.child = data

                    // let hours = await util.SumOfMultipleTimeDuration(data)
                    // formatDate = data[0].date.split(',')
                    // header.month = formatDate[1]
                    // header.day = formatDate[0]
                    // header.hours = hours
                    // result.child = data[i]

                    // }
                    // let arr = []
                    // arr.forEach(obj => [uniqObjs, dupeObjs][+(data.map(obj => obj.task_id).filter(task_id => task_id === obj.task_id).length > 1)].push(obj));

                    // console.log('====================================')
                    // console.log(dupeObjs)
                    // console.log(uniqObjs)
                    // console.log('====================================')
                    // console.log('===========all data===========')
                    // console.log(data)
                    // console.log('====================================')

                    // await this.test(request.date)
                    // let hours = await util.SumOfMultipleTimeDuration(data)
                    // formatDate = data[0].date.split(',')



                    //isApp

                    // isApp.startDate =
                    // for (let i = 0, j = 1; i < data.length, j < data.length; i++, j++) {
                    //     if (data[i].task_id === data[j].task_id) {
                    //         let hours = await util.SumOfMultipleTimeDuration(data)
                    //         formatDate = data[0].date.split(',')
                    //         header.month = formatDate[1]
                    //         header.day = formatDate[0]
                    //         header.hours = hours
                    //         result.child = data[i]

                    //     }

                    // }
                    //header
                    // header.month = formatDate[1]
                    // header.day = formatDate[0]
                    // header.hours = hours


                    // result.isApp = isApp
                    // result.header = header
                    // result.child = data
                    console.log('===========resutl============')
                    console.log(result)
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


    this.getAllTasksPerDay = async function (date, request) {
        console.log('==========enter getAllTasksPerDay==============')

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            date,
            request.employee_id
        );

        const queryString = util.getQueryString('timetracking_get_all_tasks_per_day', paramsArr);

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
        console.log('==========enter getAllWeeksByEmpId==============')
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = util.getQueryString('timetracking_get_all_weeks_by_empid', paramsArr);

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
        let isapp = {}
        let eachWeek = []
        let child = []
        let header = {}
        let headObj = {}
        let arrObj = []

        const paramsArr = new Array(
            data.first,
            data.second,
            request.employee_id
        );

        const queryString = util.getQueryString('timetracking_get_all_tasks_in_Weeks', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (dataa) => {
                    isApp.startDate = util.getMonthName(dataa[0].task_first_week_day)
                    isApp.endDate = util.getMonthName(dataa[0].task_last_week_day)

                    const start = new Date(dataa[0].task_first_week_day);
                    const end = new Date(dataa[0].task_last_week_day);
                    let loop = new Date(start);
                    //looping thw days in week
                    while (loop <= end) {
                        let date = moment.utc(loop).format("YYYY-MM-DD HH:mm:ss")
                        const [err, data1] = await this.getAllTasksPerDay(date, request)
                        if (data1.length != 0) {
                            let hours = await util.SumOfMultipleTimeDuration(data1)
                            formatDate = data1[0].date.split(',')
                            month = formatDate[1]
                            day = formatDate[0]
                            hours = hours

                            header = { month, day, hours }
                            child = data1
                            // isapp = { isApp }
                            arrObj.push({ header, child })

                            headObj.head = arrObj

                            console.log('==========arrObject(each day header and child in week)===============')
                            console.log(arrObj)
                            console.log('====================================')

                        }

                        let newDate = loop.setDate(loop.getDate() + 1);
                        loop = new Date(newDate)
                    }
                    headObj.head = arrObj

                    // eachWeek.push(headObj)
                    // let hrs = await util.SumOfTotalWeekHours(headObj.head)
                    // isApp.weekTotal = hrs

                    eachWeek.unshift({ isApp, ...headObj })
                    console.log('==========each week data===============')
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
        let responseData = [],
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









}



module.exports = TimeTrackingService;
