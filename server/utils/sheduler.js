
const schedule = require('node-schedule')
const moment = require('moment')


function Scheduler(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;


    this.sendRemainder = async function () {
        schedule.scheduleJob('00 30 10 * * 1', async function () {
            var mon = moment();
            sun = mon.subtract(1, "days");
            sun = mon.format("YYYY-MM-DD");
            let request = {}
            request.sunDate = sun

            await employeesGetEmpsTimesheetStatusNotSubmitted(request);
            async function employeesGetEmpsTimesheetStatusNotSubmitted(request) {
                let responseData = []
                error = true

                const paramsArr = new Array(
                    request.sunDate.toString(),

                );

                const queryString = util.getQueryString('employees_get_emps_timesheet_status_not_submitted', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            console.log('========MAILS TO SUBMIT TIMESHEET====data=========')
                            console.log(data)
                            console.log('====================================')
                            const [err, data1] = await employeesGetEmps(request)
                            console.log('==========data1=================')
                            console.log(data1)
                            console.log('====================================')

                            Array.prototype.push.apply(data, data1);

                            const uniqueids = [];
                            const uniqueEmails = data.filter(element => {
                                const isDuplicate = uniqueids.includes(element.email);
                                if (!isDuplicate) {
                                    uniqueids.push(element.email);
                                    return true;
                                }
                                return false;
                            });

                            uniqueEmails.map(async (d) => {
                                request.email = d.email
                                await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                            })
                            responseData = data
                            error = true
                        })
                        .catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData];
                }
            }
            async function employeesGetEmps(request) {
                let responseData = []
                error = true

                const paramsArr = new Array(
                    request.sunDate.toString(),

                );

                const queryString = util.getQueryString('employees_get_emps_lead_emergL_user', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            console.log('========employees_get_emps_lead_emergL_user=============')
                            console.log(data)
                            console.log('====================================')
                            responseData = data
                            error = true
                        })
                        .catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData];
                }
            }


        })
    }






}




module.exports = Scheduler;

