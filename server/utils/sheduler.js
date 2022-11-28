
const schedule = require('node-schedule')
const moment = require('moment')
// const EmployeeService = require('../services/employeeService')
const LeadService = require('../services/leadService')


function Scheduler(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;

    // const employeeService = new EmployeeService(objectCollection)
    const leadService = new LeadService(objectCollection)


    //on every monday at 10:30 to leads,emerging lead,users considering as all individual
    this.sendRemainder = async function () {
        schedule.scheduleJob('00 30 10 * * 1', async function () {
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

                const queryString = util.getQueryString('employees_get_emps_timesheet_status', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
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

                                let reomovedObj2Emails = []
                                if (obj1.length != 0 && obj2.length != 0) {
                                    //step1 -- removing emps haivng status 1,4 form all employess
                                    const arrayTwoEmails = new Set(obj2.map((el) => el.email));
                                    const arrayOneFiltered = emps.filter((el) => !arrayTwoEmails.has(el.email));
                                    Array.prototype.push.apply(reomovedObj2Emails, arrayOneFiltered);

                                    //step2 -- merging emps having status 5 
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
                                    //step1 -- removing emps haivng status 1,4 form all employess                                    Array.prototype.push.apply(emps, obj1);
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

                                    //step1 -- removing emps haivng status 1,4 form all employess
                                    const arrayTwoEmails = new Set(obj2.map((el) => el.email));
                                    const arrayOneFiltered = emps.filter((el) => !arrayTwoEmails.has(el.email));
                                    Array.prototype.push.apply(reomovedObj2Emails, arrayOneFiltered);
                                    sendEmails = reomovedObj2Emails
                                }
                            } else {
                                sendEmails = emps
                            }
                            if (sendEmails.length != 0) {
                                console.log('=========sendEmails===============')
                                console.log(sendEmails)
                                console.log('====================================')
                                sendEmails.map(async (mail) => {
                                    request.email = mail.email
                                    request.text = "Hi, <br><br> For approval, please submit your last week's timesheet by the end of today.Please ignore the email if the timesheet is submitted."
                                    await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                                })
                            } else {
                                console.log("no mails to send")
                            }
                        })
                        .catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                }
            }
            async function employeesGetEmps(request) {
                let responseData = []
                error = true

                const paramsArr = new Array(
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

    //on every monday at 12:30 to leads,emerging lead if anyone of the employee under then no submiutted send mail rmainder to lead , emerging lead
    this.sendRemainderToLeadsEmergingLead = async function () {
        schedule.scheduleJob('00 56 19 * * 1', async function () {
            var mon = moment();
            sun = mon.subtract(1, "days");
            sun = mon.format("YYYY-MM-DD");
            let request = {}
            request.sunDate = sun
            //get employess under leads
            //step1 get any emp is incomplete from function
           
            const [err, leads] = await leadService.getAllLeads(request, 7)
            console.log('===========GET ALL LEADS=============')
            console.log(leads)
            console.log('====================================')
            if (leads.length != 0) {
                for (let i = 0; i < leads.length; i++) {
                    if (leads[i].role_id == 4) {
                        console.log('=======GET EACH LEAD role-4===================');
                        console.log(leads[i]);
                        console.log('====================================');
                        request.text = "Hi, <br><br>  please approve the timesheets of your employees.Please ignore if already apprroved"
                        request.email = leads[i].email

                        filterLeadEmpsApproved = []
                        request.lead_assigned_employee_id = leads[i].employee_id
                        request.role_id = leads[i].role_id
                        const [err1, leadEmps] = await leadService.getEmpsAssignUnderLeadsWithoutGroups(request)
                        console.log('=====EMPLOYEES ASSIGN UNDER LEADS=========')
                        console.log(leadEmps)
                        console.log('====================================')
                        if (leadEmps.length != 0) {
                            const empsSubmitted = await employeesGetEmpsTimesheetStatusApproved(request)
                            console.log('=======GET EMPS TIMESHEET STATUS OF WEEK APPROVED===========')
                            console.log(empsSubmitted)
                            console.log('====================================')
                            if (empsSubmitted.length != 0) {
                                //comapring  empsSubmitted with lead emps
                                const arrayTwoEmails = new Set(empsSubmitted.map((el) => el.email));
                                const arrayOneFiltered = leadEmps.filter((el) => arrayTwoEmails.has(el.email));
                                Array.prototype.push.apply(filterLeadEmpsApproved, arrayOneFiltered);
                                if (filterLeadEmpsApproved.length == 0) {

                                    await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                                } else if (leadEmps.length != filterLeadEmpsApproved.length) {
                                    await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                                } else if (leadEmps.length == filterLeadEmpsApproved.length) {
                                    console.log('====================================')
                                    console.log("no mail remaninder")
                                    console.log('====================================')
                                }
                                
                            } else {
                                await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                            }

                        }
                    } else if (leads[i].role_id == 6) {
                        request.text = "Hi, <br><br>  please approve the timesheets of your employees.Please ignore if already apprroved"
                        request.email = leads[i].email

                        filterEmergingEmpsApproved = []
                        request.lead_assigned_employee_id = leads[i].employee_id
                        request.role_id = leads[i].role_id
                        const [err1, emrgingEmps] = await leadService.getEmpsAssignUnderLeadsWithoutGroups(request)
                        if (emrgingEmps.length != 0) {
                            const empsSubmitted = await employeesGetEmpsTimesheetStatusApproved(request)
                            if (empsSubmitted.length != 0) {
                                //comapring  empsSubmitted with lead emps
                                const arrayTwoEmails = new Set(empsSubmitted.map((el) => el.email));
                                const arrayOneFiltered = emrgingEmps.filter((el) => arrayTwoEmails.has(el.email));
                                Array.prototype.push.apply(filterEmergingEmpsApproved, arrayOneFiltered);
                                if (filterEmergingEmpsApproved.length == 0) {
                                    await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                                } else if (emrgingEmps.length != filterEmergingEmpsApproved.length) {
                                    await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                                } else if (emrgingEmps.length == filterEmergingEmpsApproved.length) {
                                    console.log('====================================')
                                    console.log("no mail remaninder")
                                    console.log('====================================')
                                }

                            } else {
                                await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                            }

                        }
                    }
                }

            }
            async function employeesGetEmpsTimesheetStatusApproved(request) {
                let responseData = []
                let empsApproved = []
                const paramsArr = new Array(
                    request.sunDate.toString(),
                );

                const queryString = util.getQueryString('employees_get_emps_timesheet_status', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            if (data.length != 0) {
                                //for emps having status 4 in that week
                                data.filter(function (data1) {
                                    if (data1.status_id == 5) {
                                        empsApproved.push(data1)
                                    }
                                })
                            }
                            responseData = empsApproved
                        })
                        .catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return responseData
                }
            }

        })
    }

}




module.exports = Scheduler;

