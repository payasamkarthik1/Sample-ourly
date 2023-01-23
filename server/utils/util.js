const mysql = require('mysql');
const moment = require('moment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var CryptoJS = require('crypto-js')
const nodemailer = require('nodemailer')
const randtoken = require("rand-token");



function Util() {

    this.getQueryString = function (callName, paramsArr) {
        let queryString = '',
            preparedQueryString;
        if (paramsArr.length > 0) {
            queryString = `CALL ?? (${new Array(paramsArr.length).fill('?').join(', ')});`;
            preparedQueryString = mysql.format(queryString, [String(callName)].concat(paramsArr));
            return preparedQueryString;
        }
        else if (paramsArr.length == 1) {
            preparedQueryString = mysql.format(`CALL ?? (${paramsArr[0]})`, [String(callName)].concat(paramsArr))
            return preparedQueryString;
        }
        else {
            preparedQueryString = mysql.format(`CALL ??`, [String(callName)])
            return preparedQueryString;

        }
    }

    this.getResponse = function (err, data, statusCode, request) {
        let response = {
            status: statusCode,
            time: util.getCurrentUTCTime(),
            response: data
        };
        return response
    }

    this.getRandomNumericId = function (format) {
        let id = Math.floor(Math.random() * 10000)
        return id;
    }

    this.convertTextToHash = async function (password) {
        const salt = await bcrypt.genSalt(10)
        let hashPassword = await bcrypt.hash(password, salt)
        return hashPassword
    }

    this.cryto = async function (req, res) {

        ciphertext = CryptoJS.AES.encrypt(
            req.body.password,
            'srifitpro',
        ).toString()
        return ciphertext
    }

    this.crytoconvert = async function (req, res) {
        var bytes = CryptoJS.AES.decrypt(req.body.password, 'srifitpro')
        var originalText = bytes.toString(CryptoJS.enc.Utf8)
        return originalText
    }

    this.generateJwtToken = async function (resData1) {
        const token = jwt.sign({ data: resData1 }, 'clockify')
        console.log(token);
        return token
    }

    this.verifyJwtToken = async function (request, req) {

        let responseData = []
        error = true
        const token = req.headers["authorization"]
        if (!token) {
            error = true
            responseData = [{ message: "token is required" }]
        }
        try {
            const data = await jwt.verify(token, global.config.sceret_key)
            if (data) {
                error = false,
                    responseData = data
            }
            else {
                error = true
                responseData = [{ message: "token is invalid" }]
            }

        } catch (e) {
            error = true
            responseData = [{ message: "token is invalid" }]
        }

        return [error, responseData]
    }

    this.nodemailerSender = async function (request, res) {
        var responseData = [];
        error = false;

        return new Promise((resolve, reject) => {
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
                    to: `${request.email}`, // list of receivers
                    subject: 'Ourly Request to change the password', // Subject line
                    html:
                        `
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
                                                            <h2 style="font-weight: 100;">Forget Password</h2>
                                                            <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>                                
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial, sans-serif; font-size: 16px;padding: 12px 0;">
                                                            <a href="https://www.ourly.pronteff.com/forgotpass">
                                                            <button
                                                                style="background: #d46706;color: #ffffff;border: 0;padding: 10px 50px;cursor: pointer;">Click to Change Password</button>
                                                                </a>
                                                        </td>
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
                        
                        </html>
                    `

                    // html body

                };

                // send mail with defined transport object
                const responseData = transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        error = err
                        console.log(error);
                        reject(err)
                    } else {
                        error = false
                        console.log("send")
                        resolve(error)
                    }
                });
            } catch (err) {
                console.log(err);
                error = err
            }

        })

    }

    this.nodemailerSenderForTimesheetSubmitRemainder = async function (request) {
        var responseData = [];
        error = false;

        return new Promise((resolve, reject) => {
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
                    to: `${request.email}`, // list of receivers
                    subject: 'Ourly- Reminder to submit your timesheet', // Subject line
                    html:
                        `
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
                                                            <h2 style="font-weight: 100;">Ourly- Reminder to submit your timesheet</h2>
                                                            <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>                                
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial, sans-serif; font-size: 14px;padding: 10px 0;">
                                                            <p>
                                                            ${request.text}
                                                            </p><br>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial, sans-serif; font-size: 16px;padding: 12px 0;">
                                                            <a href="https://www.ourly.pronteff.com/">
                                                            <button
                                                                style="background: #d46706;color: #ffffff;border: 0;padding: 10px 50px;cursor: pointer;">Submit Your Timesheet</button>
                                                                </a>
                                                        </td>
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
                        
                        </html>
                    `

                    // html body

                };

                // send mail with defined transport object
                const responseData = transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        error = err
                        console.log(error);
                        reject(err)
                    } else {
                        error = false
                        console.log("send")
                        resolve(error)
                    }
                });
            } catch (err) {
                console.log(err);
                error = err
            }

        })

    }

    this.nodemailerSenderForTimesheetSubmitRemainderForLeads = async function (request) {
        var responseData = [];
        error = false;

        return new Promise((resolve, reject) => {
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
                    // to: `${request.mail}`, // list of receivers
                    to: 'vishal@pronteff.com', // list of receivers
                    subject: `Ourly- Gentle Reminder:-Your ${request.text2} timesheets have not been submitted`, // Subject line
                    html:
                        `
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
                                                            <h2 style="font-weight: 100;">Ourly- Reminder to submit your timesheet</h2>
                                                            <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>                                
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial, sans-serif; font-size: 14px;padding: 10px 0;">
                                                            <p>
                                                            Ourly- Gentle Reminder:-Your ${request.text2} timesheets have not been submitted
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                    <td align="left"
                                                        style="font-family:Arial, sans-serif; font-size: 14px;padding: 10px 0;">
                                                        <p>
                                                        <h4>${request.text1}</h4>
                                                    <ol>
                                                    ${request.emps.map((item, index) => `
                                                    <li>${item}</li>
                                                  `)}
                                                  </ol>
                                                        </p><br>
                                                    </td>
                                                </tr>
                                                <tr>
                                                <td align="left"
                                                    style="font-family:Arial, sans-serif; font-size: 16px;padding: 12px 0;">
                                                    <a href="https://www.ourly.pronteff.com/">
                                                    <button
                                                        style="background: #d46706;color: #ffffff;border: 0;padding: 10px 50px;cursor: pointer;">Review</button>
                                                        </a>
                                                </td>
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
                        
                        </html>
                    `

                    // html body

                };

                // send mail with defined transport object
                const responseData = transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        error = err
                        console.log(error);
                        reject(err)
                    } else {
                        error = false
                        console.log("send")
                        resolve(error)
                    }
                });
            } catch (err) {
                console.log(err);
                error = err
            }

        })

    }

    this.nodemailerSenderOnReject = async function (request) {

        return new Promise((resolve, reject) => {
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
                    to: `${request.employee_email}`, // list of receivers
                    subject: `Timesheet Rejected
                   
                  
                  `,// Subject line
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
                                    <h2 style="font-weight: 100;">Timesheet Rejected</h2>
                                    <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="left"
                                    style="font-family:Arial, sans-serif; font-size: 16px;border:1px solid #ccc;border-radius:5px;padding: 15px;">
                                    <h2 style="font-weight: 100; margin: 0;">${request.week_name}</h2>
                                    <h4 style="color:#777;color: #777;margin: 0;padding-top: 25px;">${request.employee_name}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="left" style="font-family:Arial, sans-serif; font-size: 16px;">

                                    <h5 style="color:#777;color: #777;margin: 0;"><span
                                            style="font-weight: 100;">Rejected by:</span> ${request.rejected_by}</h5>
                                            <h5 style="color:#777;color: #777;margin: 0;"><span
                                            style="font-weight: 100;">Note:</span>${request.note}</h5>
                                </td>
                            </tr>
                            <tr>
                                                        <td align="left"
                                                            style="font-family:Arial, sans-serif; font-size: 16px;padding: 12px 0;">
                                                            <a href="https://www.ourly.pronteff.com/">
                                                            <button
                                                                style="background: #d46706;color: #ffffff;border: 0;padding: 10px 50px;cursor: pointer;">Review</button>
                                                                </a>
                                                        </td>
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
                    // html body

                };

                // send mail with defined transport object
                const responseData = transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        error = err
                        console.log(error);
                        reject(err)
                    } else {
                        error = false
                        console.log("send")
                        resolve(error)
                    }
                });
            } catch (err) {
                console.log(err);
                error = err
            }

        })

    }

    this.nodemailerSenderOnApprove = async function (request) {

        return new Promise((resolve, reject) => {
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
                    to: `${request.employee_email}`, // list of receivers
                    subject: `Timesheet Aprroved
                  
                  
                  `,// Subject line
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
                                    <h2 style="font-weight: 100;">Timesheet Approved</h2>
                                    <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="left"
                                    style="font-family:Arial, sans-serif; font-size: 16px;border:1px solid #ccc;border-radius:5px;padding: 15px;">
                                    <h2 style="font-weight: 100; margin: 0;">${request.week_name}</h2>
                                    <h4 style="color:#777;color: #777;margin: 0;padding-top: 25px;">${request.employee_name}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="left" style="font-family:Arial, sans-serif; font-size: 16px;">

                                    <h5 style="color:#777;color: #777;margin: 0;"><span
                                            style="font-weight: 100;">Approved by:</span> ${request.approved_by}</h5>
                                </td>
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


                    // html body

                };

                // send mail with defined transport object
                const responseData = transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        error = err
                        console.log(error);
                        reject(err)
                    } else {
                        error = false
                        console.log("send")
                        resolve(error)
                    }
                });
            } catch (err) {
                console.log(err);
                error = err
            }

        })

    }

    this.nodemailerSenderToLeadOnTimesheetSubmit = async function (request) {

        return new Promise((resolve, reject) => {
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
                    to: `${request.email}`, // list of receivers
                    subject: `Timesheet Submitted For Approval
                  
                  
                  `,// Subject line
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
                                    <h2 style="font-weight: 100;">Timesheet Submitted For Approval</h2>
                                    <h5 style="color:#1871b9;">Pronteff IT Solutions</h5>
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="left"
                                    style="font-family:Arial, sans-serif; font-size: 16px;border:1px solid #ccc;border-radius:5px;padding: 15px;">
                                    <h2 style="font-weight: 100; margin: 0;">${request.week_name}</h2>
                                    <h4 style="color:#777;color: #777;margin: 0;padding-top: 25px;">${request.employee_name}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="left" style="font-family:Arial, sans-serif; font-size: 16px;">

                                    <h5 style="color:#777;color: #777;margin: 0;"><span
                                            style="font-weight: 100;">Submitted by:</span> ${request.employee_name}</h5>
                                </td>
                            </tr>
                            <tr>
                            <td align="left"
                                style="font-family:Arial, sans-serif; font-size: 16px;padding: 12px 0;">
                                <a href="https://www.ourly.pronteff.com/">
                                <button
                                    style="background: #d46706;color: #ffffff;border: 0;padding: 10px 50px;cursor: pointer;">Review</button>
                                    </a>
                            </td>
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


                    // html body

                };

                // send mail with defined transport object
                const responseData = transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        error = err
                        console.log(error);
                        reject(err)
                    } else {
                        error = false
                        console.log("send")
                        resolve(error)
                    }
                });
            } catch (err) {
                console.log(err);
                error = err
            }

        })

    }

    this.generateRandtoken = async function () {
        const id = randtoken.generate(4, "0123456789");
        return id
    }

    this.addUniqueIndexesToArrayOfObject = async function (data) {

        let i = 1
        data.forEach(element => {
            element.id = i
            i += 1
        });
        return data

    }

    this.addUniqueKeyIndexesToArrayOfObject = async function (data) {

        let i = 1
        data.forEach(element => {
            element.key = i
            i += 1
        });
        return data

    }

    this.getFirstWeekDate = async function (dt) {
        d = new Date(dt);
        var day = d.getDay(),
            diff = d.getDate() - day + (d.getDay() === 0 ? -6 : 1); // adjust when day is sunday
        firstweekDay = new Date(d.setDate(diff))
        return firstweekDay.toISOString().split('T')[0]

    }

    this.getLastWeekDate = async function (dt) {
        d = new Date(dt);
        var day = d.getDay(),
            diff = d.getDate() - day + (d.getDay() === 0 ? -0 : 7); // adjust when day is sunday
        lastweekDay = new Date(d.setDate(diff))
        return lastweekDay.toISOString().split('T')[0]

    }

    this.getTimeDiff = async function (request) {

        var startTime = moment(request.task_start_time, "HH:mm:ss a"),
            endTime = moment(request.task_end_time, "HH:mm:ss a");
        var hrs = moment.utc(endTime.diff(startTime)).format("HH");
        var min = moment.utc(endTime.diff(startTime)).format("mm");
        var sec = moment.utc(endTime.diff(startTime)).format("ss");
        return [hrs, min, sec].join(':')
    }

    this.getCurrentUTCTime = function (format) {

        // let now = moment().utc().format(format || "YYYY-MM-DD HH:mm:ss");
        date = new Date()
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        current_datetime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
        return current_datetime
    }

    this.getMonthName = function (date) {
        var dt = moment(date, "YYYY-MM-DD HH:mm:ss")
        day = dt.format('Do');
        month = dt.format('MMM');
        year = dt.format('YYYY');
        return month.concat(" " + day + "," + year)

    }

    this.SumOfMultipleTimeDuration = async function (data) {
        const ms = data.map(d => moment.duration(d.task_total_time).asSeconds() * 1000);
        const sum = ms.reduce((prev, cur) => prev + cur, 0);
        const hms = moment.utc(sum).format("HH:mm:ss");
        return hms
    }

    this.dateConvertInExcel = async function (date) {

        let date1 = new Date(Math.round((date - 25569) * 864e5));
        date1.setMinutes(date1.getMinutes() + date1.getTimezoneOffset());
        return moment(date1).utc().format("YYYY-MM-DD");
    }

    this.getWeekName = async function (request) {
        date1 = await this.getFirstWeekDate(request.task_created_datetime)
        date2 = await this.getLastWeekDate(request.task_created_datetime)

        var dt1 = moment(date1, "YYYY-MM-DD HH:mm:ss")
        day1 = dt1.format('Do');
        month1 = dt1.format('MMM');
        year1 = dt1.format('YYYY');
        firstMonth = month1.concat(" " + day1 + "," + year1)

        var dt2 = moment(date2, "YYYY-MM-DD HH:mm:ss")
        day2 = dt2.format('Do');
        month2 = dt2.format('MMM');
        year2 = dt2.format('YYYY');
        lastMonth = month2.concat(" " + day2 + "," + year2)

        return firstMonth.concat(" - " + lastMonth)
    }

    this.sumOfTime = async function (data) {
        //     console.log('====================================')
        //     console.log(data)
        //     console.log('====================================')

        //     var prodhrd = "00:00:00";
        //     for (let i = 0; i < data.length; i++) {

        //         var conprodArr = data[i].task_total_time;
        //         prodhrdArr = prodhrd.split(":");
        //         conprodArr = conprodArr.split(":");
        //         var hh1 = parseInt(prodhrdArr[0]) + parseInt(conprodArr[0]);
        //         var mm1 = parseInt(prodhrdArr[1]) + parseInt(conprodArr[1]);
        //         var ss1 = parseInt(prodhrdArr[2]) + parseInt(conprodArr[2]);

        //         if (ss1 > 59) {
        //             var ss2 = ss1 % 60;
        //             var ssx = ss1 / 60;
        //             var ss3 = parseInt(ssx);//add into min
        //             var mm1 = parseInt(mm1) + parseInt(ss3);
        //             var ss1 = ss2;
        //         }
        //         if (mm1 > 59) {
        //             var mm2 = mm1 % 60;
        //             var mmx = mm1 / 60;
        //             var mm3 = parseInt(mmx);//add into hour
        //             var hh1 = parseInt(hh1) + parseInt(mm3);
        //             var mm1 = mm2;
        //         }
        //         var finaladd = hh1 + ':' + mm1 + ':' + ss1;
        //         prodhrd = finaladd

        //     }

        //     console.log('=========finaladd================')
        //     console.log(finaladd)
        //     console.log('====================================')
        //     return finaladd

        // }
        function timestrToSec(timestr) {
            var parts = timestr.split(":");
            return (parts[0] * 3600) +
                (parts[1] * 60) +
                (+parts[2]);
        }

        function pad(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return "" + num;
            }
        }

        async function formatTime(seconds) {
            return [pad(Math.floor(seconds / 3600)),
            pad(Math.floor(seconds / 60) % 60),
            pad(seconds % 60),
            ].join(":");
        }

        time1 = "00:00:00"
        for (let i = 0; i < data.length; i++) {
            time2 = data[i].task_total_time
            var total = await formatTime(timestrToSec(time1) + timestrToSec(time2))
            time1 = total
        }
        return total
    }




}


module.exports = Util