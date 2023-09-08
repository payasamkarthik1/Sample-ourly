
const schedule = require('node-schedule')
const moment = require('moment')
const EmployeeService = require('../services/employeeService')
const LeadService = require('../services/leadService')
const nodemailer = require('nodemailer')


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
                    console.log('================================remainder mails at momnday 9am===========================================')
                    await sendMails.map(async (mail) => {
                        console.log(mail.email)
                    })
                    console.log('=========================================================')
                    await sendMails.map(async (mail) => {
                        request.email = mail.email
                        request.text = "Hi, <br><br> For approval, please submit your last week's timesheet by the end of today.Please ignore the email if the timesheet is submitted."
                        // await util.nodemailerSenderForTimesheetSubmitRemainder(request)
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
                    // await util.nodemailerSenderForTimesheetSubmitRemainderForLeads(request)
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

    this.sendRemainderToProjectLeads = async function () {
        console.log("-------------------------entered sendRemainderToProjetLeads------------------------------");
        schedule.scheduleJob('00 00 11 * * *', async function () {
            const [err, res, weekName] = await leadService.getProjectsAndLeads()

            for (let item of res) {

                let html = `
              <table align="left" style="padding: 15px 15px 0 15px; width:585px; border-spacing:0; ">
                <thead>
                <tr>
                <td style="color: green"><h3>Submitted</h3></td>
              </tr>
                </thead>
                <tbody>
              `;

                if (item.submittedData.length > 0) {
                    item.submittedData.forEach(submittedData => {
                        html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                    <b>${submittedData.project_name}</b>
                </td>
            </tr>
                  <tr>
                    <td colspan="2">${generateDataHTML(submittedData.data)}</td>
                  </tr>
                `;
                    });
                } else {
                    html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                    NO Data
                </td>
            </tr>`
                }

                html += `
                </tbody>
              </table>
              <table align="left" style="padding: 15px 15px 0 15px; width:585px; border-spacing:0; ">
                <thead>
                <tr>
                <td style="color: red"><h3>UnSubmitted</h3></td>
              </tr>
                </thead>
                <tbody>
              `;

                if (item.unSubmittedData.length > 0) {
                    item.unSubmittedData.forEach(unSubmittedData => {
                        html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                    <b>${unSubmittedData.project_name}</b>
                </td>
            </tr>
                  <tr>
                    <td colspan="2">${generateDataHTML(unSubmittedData.data)}</td>
                  </tr>
                `;
                    });
                } else {
                    html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                   NO Data
                </td>
            </tr>`
                }

                html += `
                </tbody>
              </table>
              `;

                function generateDataHTML(data) {
                    let dataHTML = "<ul>";

                    data.forEach(item => {
                        dataHTML += `<li>${item.name}</li>`;
                    });

                    dataHTML += "</ul>";
                    return dataHTML;
                }

                // console.log(html);


                if (item.unSubmittedData.length > 0 || item.submittedData.length > 0) {
                    //  return new Promise((resolve, reject) => {
                    try {
                        var smtpConfig = {
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true, // use SSL
                            auth: {
                                user: 'no-reply@pronteff.com',
                                pass: 'Welcome@1234'
                            }
                        };
                        let transporter = nodemailer.createTransport(smtpConfig);

                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: 'no-reply@pronteff.com', // sender address
                            to: `${item.project_lead_mail}`, // list of receivers
                            subject: `Ourly- Reminder:-External Projects_Your Project  members timesheets`,// Subject line
                            html: `
                                        <!DOCTYPE html>
                                        <html lang="en">
                                        
                                        <head>
                                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <meta name="viewport" content="width=device-width, initial-scale=1">
                                            <title>Ourly</title>
                                        </head>
                                        
                                        <body style="padding: 30px;background: #f3f4fb;">
                                            <table align="center" style="padding:0; width:600px; border-spacing:0; background: #ffffff;
                                                margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style="font-size: 12px; color: #ffffff; padding: 4px 15px; line-height: 0; position: relative; background: #0c1d40;border-top-right-radius: 5px;border-top-left-radius: 5px;">
                                        
                                                            <img src="https://pronteff.com/ourly-logo.png" alt="" style="width: 16%;">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <table align="left" style="padding: 15px 15px 0 15px; width:585px; border-spacing:0; ">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                                                                            <h2 style="font-weight: 100;">Employee overview</h2>
                                                                            <p>Please verify the below list of all Project team members who submitted and did not submit their timesheets last week.</p>
                                                                            <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>&nbsp;</td>
                                                                    </tr>
                                                                    <h3>${weekName}</h3>
                                                                    ${html}

                                                                    <tr>
                                                                        <td>&nbsp;</td>
                                                                    </tr>
                                        
                                                                    <tr>
                                                                        <td
                                                                            style="border-top:1px solid #ccc; font-size:12px; font-family: Arial, sans-serif;text-align: center;">
                                                                            <p>@Ourly powered by<span style="font-weight: 600;color: #0c1d40;
                                                                                padding-left: 4px;">Pronteff IT Solutions</span></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </body>
                                        
                                        </html>`


                        };

                        // send mail with defined transport object
                        const responseData = transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                error = err
                                console.log(error);
                                // reject(err)
                            } else {
                                error = false
                                console.log("send")
                                // resolve(error)
                            }
                        });
                    } catch (err) {
                        console.log(err);
                        error = err
                    }

                    // })
                }
            }
        })
    }

    this.sendSubmittedAndUnsubmittedListToLeads = async function () {
        console.log("-------------------------entered sendSubmittedAndUnsubmittedListToLeads------------------------------");
        schedule.scheduleJob('00 00 12 * * *', async function () {
            const [err, res, weekName] = await leadService.getLeadProjectsAndSelfApprovalDataForEmailSending()

            for (let item of res) {

                let html = `
              <table align="left" style="padding: 15px 15px 0 15px; width:585px; border-spacing:0; ">
                <thead>
                <tr>
                <td style="color: green"><h3>Submitted</h3></td>
              </tr>
                </thead>
                <tbody>
              `;

                if (item.submittedData.length > 0) {
                    item.submittedData.forEach(submittedData => {
                        html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                    <b>${submittedData.project_name}</b>
                </td>
            </tr>
                  <tr>
                    <td colspan="2">${generateDataHTML(submittedData.data)}</td>
                  </tr>
                `;
                    });
                } else {
                    html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                    NO Data
                </td>
            </tr>`
                }

                html += `
                </tbody>
              </table>
              <table align="left" style="padding: 15px 15px 0 15px; width:585px; border-spacing:0; ">
                <thead>
                <tr>
                <td style="color: red"><h3>UnSubmitted</h3></td>
              </tr>
                </thead>
                <tbody>
              `;

                if (item.unSubmittedData.length > 0) {
                    item.unSubmittedData.forEach(unSubmittedData => {
                        html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                    <b>${unSubmittedData.project_name}</b>
                </td>
            </tr>
                  <tr>
                    <td colspan="2">${generateDataHTML(unSubmittedData.data)}</td>
                  </tr>
                `;
                    });
                } else {
                    html += `
                <tr>
                <td align="left"
                    style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                   NO Data
                </td>
            </tr>`
                }

                html += `
                </tbody>
              </table>
              `;

                function generateDataHTML(data) {
                    let dataHTML = "<ul>";

                    data.forEach(item => {
                        dataHTML += `<li>${item.name}</li>`;
                    });

                    dataHTML += "</ul>";
                    return dataHTML;
                }

                // console.log(html);


                if (item.unSubmittedData.length > 0 || item.submittedData.length > 0) {
                    //  return new Promise((resolve, reject) => {
                    try {
                        var smtpConfig = {
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true, // use SSL
                            auth: {
                                user: 'no-reply@pronteff.com',
                                pass: 'Welcome@1234'
                            }
                        };
                        let transporter = nodemailer.createTransport(smtpConfig);

                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: 'no-reply@pronteff.com', // sender address
                            to: `${item.project_lead_mail}`, // list of receivers
                            subject: `Ourly- Reminder:-Internal Projects_Your team members timesheets`,// Subject line
                            html: `
                                        <!DOCTYPE html>
                                        <html lang="en">
                                        
                                        <head>
                                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <meta name="viewport" content="width=device-width, initial-scale=1">
                                            <title>Ourly</title>
                                        </head>
                                        
                                        <body style="padding: 30px;background: #f3f4fb;">
                                            <table align="center" style="padding:0; width:600px; border-spacing:0; background: #ffffff;
                                                margin: 0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style="font-size: 12px; color: #ffffff; padding: 4px 15px; line-height: 0; position: relative; background: #0c1d40;border-top-right-radius: 5px;border-top-left-radius: 5px;">
                                        
                                                            <img src="https://pronteff.com/ourly-logo.png" alt="" style="width: 16%;">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <table align="left" style="padding: 15px 15px 0 15px; width:585px; border-spacing:0; ">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="font-family:Arial, sans-serif; font-size: 16px;border-bottom:1px solid #ccc;">
                                                                            <h2 style="font-weight: 100;">Employee overview</h2>
                                                                            <p>Please verify the below list of all  team members who submitted and did not submit their timesheets last week..</p>
                                                                            <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>&nbsp;</td>
                                                                    </tr>
                                                                    <h3>${weekName}</h3>
                                                                    ${html}

                                                                    <tr>
                                                                        <td>&nbsp;</td>
                                                                    </tr>
                                        
                                                                    <tr>
                                                                        <td
                                                                            style="border-top:1px solid #ccc; font-size:12px; font-family: Arial, sans-serif;text-align: center;">
                                                                            <p>@Ourly powered by<span style="font-weight: 600;color: #0c1d40;
                                                                                padding-left: 4px;">Pronteff IT Solutions</span></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </body>
                                        
                                        </html>`


                        };

                        // send mail with defined transport object
                        const responseData = transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                error = err
                                console.log(error);
                                // reject(err)
                            } else {
                                error = false
                                console.log("send")
                                // resolve(error)
                            }
                        });
                    } catch (err) {
                        console.log(err);
                        error = err
                    }

                    // })
                }
            }
        })
    }
}




module.exports = Scheduler;

