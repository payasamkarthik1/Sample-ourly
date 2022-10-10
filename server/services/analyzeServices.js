

const TimeTrackingService = require('../services/timeTrackingService')

function AnalyzeServices(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const timeTrackingService = new TimeTrackingService(objectCollection)


    this.getDasboardOverview = async function (request) {
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
                        const [err1, data1] = await timeTrackingService.getWorkedHrsOfEachPrjInWeek(request)
                        const [err2, data2] = await timeTrackingService.getWorkedHrsOfAllPrjsInDay(request)
                        const [err3, data3] = await timeTrackingService.getWorkedHoursOfAllTasksWeekly(request)
                        const [err4, data4] = await this.getTopProjectBasedOnHrs(request)


                        console.log('=======DATA4=======')
                        console.log(data4)
                        console.log('====================================')

                        data4.forEach(function (object, i) {
                            var array = object.highesh.split(":");
                            var seconds = (parseInt(array[0], 10) * 60 * 60) + (parseInt(array[1], 10) * 60) + parseInt(array[2], 10)
                            object.num = seconds

                        })
                        console.log('=======after  DATA4=======')
                        console.log(data4)
                        console.log('====================================')

                        //highesh
                        // var max = data4.reduce(function (prev, current) {
                        //     if (+current.highesh > +prev.highesh) {
                        //         return current;
                        //     } else {
                        //         return prev;
                        //     }
                        // });

                        // console.log(max);

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

    this.getTopProjectBasedOnHrs = async function (request) {
        let responseData = [],
            error = true;
        //flag =4 for total hours calculation for all projects for a given week 
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


    };


}



module.exports = AnalyzeServices;
