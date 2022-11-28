
const schedule = require('node-schedule')
const moment = require('moment')
const EmployeeService = require('../services/employeeService')


function Scheduler(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;

    const employeeService = new EmployeeService(objectCollection)


    this.sendRemainder = async function () {
        schedule.scheduleJob('00 30 14 * * 1', async function () {
            var mon = moment();
            sun = mon.subtract(1, "days");
            sun = mon.format("YYYY-MM-DD");
            let request = {}
            request.sunDate = sun

            const [err, emps] = await employeesGetEmps(request)
            if (emps.length != 0) {
                await employeesGetEmpsTimesheetStatusNotSubmitted(request);
            } else {
                console.log("No employees available")
            }
            async function employeesGetEmpsTimesheetStatusNotSubmitted(request) {

                const paramsArr = new Array(
                    request.sunDate.toString(),
                );

                const queryString = util.getQueryString('employees_get_emps_timesheet_status_not_submitted', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            console.log('========employees_get_emps_timesheet_status_not_submitted====data=========')
                            console.log(data)
                            console.log('====================================')

                            sendEmails = []
                            if (data.length != 0) {
                                //for emps having status 5 in that week
                                obj1 = []
                                //for emps having status 1 and 4 in that week
                                obj2 = []
                                data.filter(function (data1) {
                                    if (data1.status_id == 5) {
                                        obj1.push(data1)
                                    } else {
                                        obj2.push(data1)
                                    }
                                })

                                if (obj1.length != 0 && obj2.length != 0) {
                                    //step1
                                    reomovedObj2Emails = []
                                    emps.map((d1) => {
                                        obj2.map((d2) => {
                                            if (d1.email !== d2.email) {
                                                Array.prototype.push.apply(reomovedobj2Emails, d1);
                                            }
                                        })
                                    })

                                    //step2
                                    Array.prototype.push.apply(reomovedObj2Emails, obj1);
                                    //unique
                                    const uniqueids = [];
                                    sendEmails = reomovedObj2Emails.filter(element => {
                                        const isDuplicate = uniqueids.includes(element.email);
                                        if (!isDuplicate) {
                                            uniqueids.push(element.email);
                                            return true;
                                        }
                                        return false;
                                    });

                                } else if (obj1.length != 0 && obj2.length == 0) {
                                    //step2
                                    Array.prototype.push.apply(emps, obj1);
                                    //unique
                                    const uniqueids = [];
                                    sendEmails = emps.filter(element => {
                                        const isDuplicate = uniqueids.includes(element.email);
                                        if (!isDuplicate) {
                                            uniqueids.push(element.email);
                                            return true;
                                        }
                                        return false;
                                    });
                                } else if (obj1.length == 0 && obj2.length != 0) {
                                    //step1
                                    reomovedObj2Emails = []
                                    emps.map((d1) => {
                                        obj2.map((d2) => {
                                            if (d1.email !== d2.email) {
                                                Array.prototype.push.apply(reomovedobj2Emails, d1);
                                            }
                                        })
                                    })
                                    sendEmails = reomovedObj2Emails
                                }
                            } else {
                                sendEmails = emps
                            }
                            sendEmails.map(async (mail) => {
                                request.email = mail.email
                                await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                            })
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

                const queryString = util.getQueryString('employee_get_all_emps_for_timesheet_remainder_select', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            console.log('========employee_get_all_emps_for_timesheet_remainder_select=============')
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

