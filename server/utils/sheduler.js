
const schedule = require('node-schedule')
const moment = require('moment')


function Scheduler(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;


    this.sendRemaider = async function (request) {
        schedule.scheduleJob('00 24 15 * * 4', async function () {
            // var mon = moment();
            // sun = mon.subtract(1, "days");
            // sun = mon.format("YYYY-MM-DD");
            sun = "2022-11-15"
            request.sun = sun

            const [err, data] = this.employeesGetEmpsTimesheetStatusNotSubmitted(request)

            data.map(async (d) => {
                request.email = d
                await this.nodemailerSenderForTimesheetSubmitRemainder(request)
            })

        })
    }


    this.employeesGetEmpsTimesheetStatusNotSubmitted = async function (request) {
        console.log('====================================')
        console.log("entered")
        console.log('====================================')
        let responseData = []
        error = true


        const paramsArr = new Array(
            request.toString(),

        );

        const queryString = util.getQueryString('employees_get_emps_timesheet_status_not_submitted', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then(async (data) => {
                    console.log('====================================')
                    console.log(data)
                    console.log('====================================')
                    responseData = data
                    error = true
                })
                .catch((err) => {
                    error = err;
                })
            return [error, responseData];
        }
    }
}

module.exports = Scheduler;

