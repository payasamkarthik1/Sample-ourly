
const schedule = require('node-schedule')
const moment = require('moment')


function Scheduler(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;


    this.sendRemaider = async function () {
        schedule.scheduleJob('00 29 16 * * 4', async function () {
            console.log('====================================')
            console.log("EEeee")
            console.log('====================================')
            // var mon = moment();
            // sun = mon.subtract(1, "days");
            // sun = mon.format("YYYY-MM-DD");
            let request = {}
            sun = "2022-11-15"
            request.dat = sun

                const paramsArr = new Array(
                    request.dat.toString(),
    
                );    
                const queryString = util.getQueryString('employees_get_emps_timesheet_status_not_submitted', paramsArr);
                if (queryString !== '') {
                     db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            console.log('=========DATAA=========')
                            console.log(data)
                            console.log('====================================')
                            // responseData = data
                            // error = true
                            data.map(async (d) => {
                                request.email = d
                                await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                            })
                        })
                        .catch((err) => {
                            error = err;
                        })
                    return [error, responseData];
                }
            // }
           

           

        })
    }

}



    module.exports = Scheduler;

