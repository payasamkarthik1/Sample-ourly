
const schedule = require('node-schedule')
const moment = require('moment')


function Scheduler(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;


    this.sendRemaider = async function () {
        schedule.scheduleJob('00 23 17 * * 4', async function () {
            console.log('====================================')
            console.log("EEeee")
            console.log('====================================')
            // var mon = moment();
            // sun = mon.subtract(1, "days");
            // sun = mon.format("YYYY-MM-DD");
            let request = {}
            sun = "2022-11-13"
            request.dat = sun

            await employeesGetEmpsTimesheetStatusNotSubmitted(request);
            async function employeesGetEmpsTimesheetStatusNotSubmitted(request) {
                console.log('====================================')
                console.log("entered")
                console.log('====================================')
                let responseData = []
                error = true

                const paramsArr = new Array(
                    request.dat.toString(),

                );

                const queryString = util.getQueryString('employees_get_emps_timesheet_status_not_submitted', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            console.log('====================================')
                            console.log(data)
                            console.log('====================================')
                            data.map(async (d) => {
                                request.email = d
                                await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                            })
                            responseData = data
                            error = true
                        })
                        .catch((err) => {
                            error = err;
                        })
                    return [error, responseData];
                }
            }




        })
    }






}




module.exports = Scheduler;

