
const schedule = require('node-schedule')
const moment = require('moment')
const EmployeeService = require('../services/employeeService')
const LeadService = require('../services/leadService')


function Scheduler(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;

    const employeeService = new EmployeeService(objectCollection)
    const leadService = new LeadService(objectCollection)


    //on every monday at 10:30 to leads,emerging lead,users considering as all individual
    this.sendRemainder = async function () {
        schedule.scheduleJob('00 30 10 * * 1', async function () {
            var mon = moment();
            sun = mon.subtract(1, "days");
            sun = mon.format("YYYY-MM-DD");
            let request = {}
            request.sunDate = sun

            let sendMails = []
            const [err, emps] = await employeeService.getAllEmployees(request)
            console.log('============getAllEmployees=================')
            console.log(emps)
            console.log('====================================')
            const [err1, emps1] = await employeesGetEmpsTimesheetStatusApproved(request)
            console.log('============employeesGetEmpsTimesheetStatusApproved=================')
            console.log(emps1)
            console.log('====================================')
            if (emps.length != 0) {
                if (emps1.length != 0) {
                    for (let i = 0; i < emps.length; i++) {
                        console.log(emps[i])
                        emps1.filter((item) => {
                            if (item.email != emps[i].email) {
                                sendMails.push(emps[i])
                            }
                        });
                    }
                } else {
                    sendMails = emps
                }
                console.log('===========sendMails=================')
                console.log(sendMails)
                console.log('====================================')
                await sendMails.map(async (mail) => {
                    request.email = mail.email
                    request.text = "Hi, <br><br> For approval, please submit your last week's timesheet by the end of today.Please ignore the email if the timesheet is submitted."
                    await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                })
            } else {
                console.log("No employees available")
            }


            async function employeesGetEmpsTimesheetStatusApproved(request) {
                let responseData = []
                let error = true
                const paramsArr = new Array(
                    request.sunDate.toString(),
                );

                const queryString = util.getQueryString('employees_get_emps_timesheet_status', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            responseData = data
                            error = false
                        })
                        .catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData]
                }
            }

        })
    }



    this.sendRemainder1 = async function () {
        schedule.scheduleJob('00 35 15 * * 4', async function () {
            var mon = moment();
            sun = mon.subtract(4, "days");
            sun = mon.format("YYYY-MM-DD");
            let request = {}
            request.sunDate = sun

            let sendMails = []

            //get groups
            request.role_id = 2
            const [err, emps] = await leadService.getEmployessAssignUnderHeadsAdminAndEmpl(request, 2)
            grps = emps[0].groups
            console.log('==========groups====================')
            console.log(grps)
            console.log('====================================')

            //get emps assign under grps
            for (let i = 0; i < grps.length; i++) {
                let empUnderGrpWithStatus = []
                let count = []
                // let emps =[]
                request.employee_id = grps[i].employee_id, request.role_id = 0
                const [err1, emps1] = await leadService.getEmployessAssignUnderHeadsAdminAndEmpl(request, 1)
                console.log('==========emps1====================')
                console.log(emps1)
                console.log('====================================')

                for (let j = 0; j < emps1.length; j++) {
                    request.employee_id = emps1[j].employee_id
                    const [err2, emps2] = await employeesGetEmpsTimesheetStatusByEmpid(request)
                    console.log('==========emps2====================')
                    console.log(emps2)
                    console.log('====================================')
                    if (emps2.length != 0) {
                        empUnderGrpWithStatus.push(emps2[0])
                    }
                }
                console.log('===========empUnderGrpWithStatus==================')
                console.log(empUnderGrpWithStatus)
                console.log('====================================')
                if (empUnderGrpWithStatus.length == 0) {
                    request.mail = grps[i].email
                    request.emps = emps1
                } else {
                    for (let i = 0; i < emps1.length; i++) {
                        empUnderGrpWithStatus.filter((item) => {
                            console.log('=========item==================')
                            console.log(item.email)
                            console.log(emps1[i].email)
                            console.log('====================================')
                            if (item.email !== emps1[i].email) {
                                count.push(emps1[i])
                            }
                        });
                    }
                    console.log('==========count===================')
                    console.log(count)
                    console.log('====================================')
                    if (count.length != 0) {
                        request.mail = grps[i].email
                        request.emps = count
                    }

                }

                console.log('=================================at the and......for each loopp===================')
                console.log(request.mail)
                console.log(request.emps)

                console.log('====================================')

            }



            // console.log('============getAllEmployees=================')
            // console.log(emps)
            // console.log('====================================')
            // const [err1, emps1] = await employeesGetEmpsTimesheetStatusApproved(request)
            // console.log('============employeesGetEmpsTimesheetStatusApproved=================')
            // console.log(emps1)
            // console.log('====================================')
            // if (emps.length != 0) {
            //     if (emps1.length != 0) {
            //         for (let i = 0; i < emps.length; i++) {
            //             console.log(emps[i])
            //             emps1.filter((item) => {
            //                 if (item.email != emps[i].email) {
            //                     sendMails.push(emps[i])
            //                 }
            //             });
            //         }
            //     } else {
            //         sendMails = emps
            //     }
            //     console.log('===========sendMails=================')
            //     console.log(sendMails)
            //     console.log('====================================')
            //     await sendMails.map(async (mail) => {
            //         request.email = mail.email
            //         request.text = "Hi, <br><br> For approval, please submit your last week's timesheet by the end of today.Please ignore the email if the timesheet is submitted."
            //         await util.nodemailerSenderForTimesheetSubmitRemainder(request)
            //     })
            // } else {
            //     console.log("No employees available")
            // }


            async function employeesGetEmpsTimesheetStatusByEmpid(request) {
                let responseData = []
                let error = true
                const paramsArr = new Array(
                    request.sunDate.toString(),
                    request.employee_id
                );

                const queryString = util.getQueryString('employees_get_emps_timesheet_status_by_empid', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then(async (data) => {
                            responseData = data
                            error = false
                        })
                        .catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                    return [error, responseData]
                }
            }

        })
    }

    //  on every monday at 12:30 to leads,emerging lead if anyone of the employee under then no submiutted send mail rmainder to lead , emerging lead
    // this.sendRemainderToLeadsEmergingLead = async function () {
    //     schedule.scheduleJob('00 30 12 * * 1', async function () {
    //         var mon = moment();
    //         sun = mon.subtract(1, "days");
    //         sun = mon.format("YYYY-MM-DD");
    //         let request = {}
    //         request.sunDate = sun
    //         let headsGather = []
    //         //get all heads 
    //         const [err, heads] = await leadService.getAllHeads(request, 7)
    //         //get all emps
    //         const [err2, data2] = await employeeService.getAllEmployees(request)

    //         if (heads.length != 0) {
    //             for (let i = 0; i < heads.length; i++) {
    //                 request.employee_id = heads[i]
    //                 const [err1, data1] = await leadService.getEmployessAssignUnderHeads(request, 1)
    //                 const [err3, data3] = await employeesGetEmpsTimesheetStatusApproved(request, 1)
    //                 var unique = [];
    //                 if (data3.length != 0) {
    //                     for (var i = 0; i < data1.length; i++) {
    //                         var found = false;
    //                         for (var j = 0; j < data3.length; j++) { // j < is missed;
    //                             if (data1[i] == data3[j]) {
    //                                 found = true;
    //                                 break;
    //                             }
    //                         }
    //                         if (found == false) {
    //                             unique.push(data1[i]);
    //                         }
    //                     }
    //                 }
    //                 if (data1.length != unique.length) {
    //                     headsGather.push(heads[i].email)
    //                 }

    //             }
    //             if (headsGather.length != 0) {
    //                 headsGather.map(async (mail) => {
    //                     request.email = mail.email
    //                     request.text = "Hi, <br><br> For approval, please submit your last week's timesheet by the end of today.Please ignore the email if the timesheet is submitted."
    //                     await util.nodemailerSenderForTimesheetSubmitRemainder(request)
    //                 })
    //             } else {
    //                 console.log("no mails to send");
    //             }

    //         }

    //         async function employeesGetEmpsTimesheetStatusApproved(request) {
    //             let responseData = []
    //             let error = true
    //             const paramsArr = new Array(
    //                 request.sunDate.toString(),
    //             );

    //             const queryString = util.getQueryString('employees_get_emps_timesheet_status', paramsArr);
    //             if (queryString !== '') {
    //                 await db.executeQuery(0, queryString, request)
    //                     .then(async (data) => {
    //                         responseData = data
    //                         error = false
    //                     })
    //                     .catch((err) => {
    //                         console.log("err-------" + err);
    //                         error = err
    //                     })
    //                 return responseData
    //             }
    //         }

    //     })
    // }

}




module.exports = Scheduler;

