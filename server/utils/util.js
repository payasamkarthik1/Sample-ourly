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
        let id = Math.floor(Math.random() * 1000)
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
                let transporter = nodemailer.createTransport({

                    service: 'gmail',
                    auth: {
                        user: 'vengalavishal92@gmail.com',
                        pass: 'iufhppuqnqmsqocv',
                    }

                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'vengalavishal92@gmail.com', // sender address
                    to: `${request.email}`, // list of receivers
                    subject: 'Prontify Request to change the password', // Subject line
                    html: `<a href="http://192.168.0.217:3000/forgotpass">Click to Change Password</a>`

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
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'vengalavishal92@gmail.com',
                        pass: 'iufhppuqnqmsqocv',
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'vengalavishal92@gmail.com', // sender address
                    to: `${request.employee_email}`, // list of receivers
                    subject: `Timesheet rejected
                   
                  
                  `,// Subject line
                    html: `
                    <h1>Timesheet rejected</h1>
                    <h3>Pronteff IT Solutions</h3>
                    <h1>${request.week_name}</h1>
                    <h2>${request.employee_name}</h2>
                    <p>Rejected by:${request.rejected_by}</p>
                    <p>Note: ${request.note}</p>
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
    this.nodemailerSenderOnApprove = async function (request) {

        return new Promise((resolve, reject) => {
            try {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'vengalavishal92@gmail.com',
                        pass: 'iufhppuqnqmsqocv',
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'vengalavishal92@gmail.com', // sender address
                    to: `${request.employee_email}`, // list of receivers
                    subject: `<h1>Timesheet Aprroved</h1>
                    <p>Pronteff IT Solutions</p>
                  
                  `,// Subject line
                    html: `
                    <h1>${request.week_name}</h1>
                    <h2>${request.employee_name}</h2>
                    <p>Approved by:${request.approved_by}</p>
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

    this.generateRandtoken = async function (req) {
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
        let now = moment().utc().format(format || "YYYY-MM-DD HH:mm:ss");
        return now;
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

        return firstMonth.concat(" " + lastMonth)
    }

}

module.exports = Util