
const schedule = require('node-schedule')
const moment = require('moment')
const EmployeeService = require('../services/employeeService')
const LeadService = require('../services/leadService')



function Scheduler(objectCollection) {
    console.log("-------------------------entered Scheduler-------------------------------")

    const util = objectCollection.util;
    const db = objectCollection.db;
    const employeeService = new EmployeeService(objectCollection)
    const leadService = new LeadService(objectCollection)


    //on every monday at 09:00 to all emps
    this.sendRemainder = async function () {
        console.log("-------------------------entered sendRemainder------------------------------");
        schedule.scheduleJob('00 00 09 * * 1', async function () {
            var mon = moment();
            sun = mon.subtract(1, "days");
            sun = mon.format("YYYY-MM-DD");
            let request = {}
            request.sunDate = sun
            let sendMails = []
            const [err, emps] = await employeeService.getAllEmployees(request)
            const [err1, emps1] = await employeesGetEmpsTimesheetStatusApproved(request)

            if (emps.length != 0) {
                if (emps1.length != 0) {
                    myArray = emps.filter(ar => !emps1.find(rm => (rm.email === ar.email)))
                    sendMails = myArray
                } else {
                    sendMails = emps
                }
                if (sendMails.length != 0) {
                    console.log('================================sendMails===========================================')
                    console.log(sendMails)
                    console.log('=========================================================')
                    await sendMails.map(async (mail) => {
                        request.email = mail.email
                        request.text = "Hi, <br><br> For approval, please submit your last week's timesheet by the end of today.Please ignore the email if the timesheet is submitted."
                       //  await util.nodemailerSenderForTimesheetSubmitRemainder(request)
                    })
                }
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
    
    //on every monday at 12:30 to leads
    this.sendRemainderToLeads = async function () {
        console.log("-------------------------entered sendRemainderToLeads------------------------------");
        schedule.scheduleJob('00 30 12 * * 1', async function () {
            var mon = moment();
            sun = mon.subtract(1, "days");
            sun = mon.format("YYYY-MM-DD");
            let request = {}
            request.sunDate = sun

            //get groups
            request.role_id = 2
            const [err, emps] = await leadService.getEmployessAssignUnderHeadsAdminAndEmpl(request, 2)
            grps = emps[0].groups
            //get emps assign under grps
            for (let i = 0; i < grps.length; i++) {
                request.mail = ""
                request.text1 = ""

                let empUnderGrpWithStatus = []
                let count = []
                // let emps =[]
                request.employee_id = grps[i].employee_id
                const emps1 = await leadService.getEmpsUnderHeadsLevel1(request)

                for (let j = 0; j < emps1.length; j++) {
                    request.employee_id = emps1[j].employee_id
                    const [err2, emps2] = await employeesGetEmpsTimesheetStatusByEmpid(request)
                    if (emps2.length != 0) {
                        empUnderGrpWithStatus.push(emps2[0])
                    }
                }
                if (empUnderGrpWithStatus.length == 0) {
                    request.mail = grps[i].email
                    request.emps = emps1
                } else {
                    myArray = emps1.filter(ar => !empUnderGrpWithStatus.find(rm => (rm.email === ar.email)))
                    count = myArray
                    if (count.length != 0) {
                        request.mail = grps[i].email
                        request.emps = count
                    }
                }
                
                if (request.mail != "") {
                    if (request.emps.length == 1) {
                        request.text1 = "Team Member:-"
                        request.text3 = "team member"
                        request.text4 = "timesheet"
                        request.text2 = "your team member"
                        request.text5 = "his/her"
                        request.text6 = "is"

                    } else {
                        request.text1 = "Team Members:-"
                        request.text3 = "team members"
                        request.text2 = "all your team members"
                        request.text4 = "timesheets"
                        request.text5 = "their"
                        request.text6 = "is a list of"

                    }
                    request.text = `Hi,
                     <br><br> 
                     Please make sure  ${request.text2} submit ${request.text5} ${request.text4} by the end of every week.
                     <br> Below  ${request.text6}  ${request.text2} who did not submit ${request.text5} ${request.text4} last week..`
                 //   await util.nodemailerSenderForTimesheetSubmitRemainderForLeads(request)
                }

            }

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
}





module.exports = Scheduler;

