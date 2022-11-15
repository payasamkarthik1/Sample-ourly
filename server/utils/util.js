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

                    service: 'pronteff',
                    auth: {
                        user: 'vishal@pronteff.com',
                        pass: 'iufhppuqnqmsqocv',
                    }

                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'vishal@pronteff.com', // sender address
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
                    service: 'pronteff',
                    auth: {
                        user: 'vishal92@pronteff.com',
                        pass: 'iufhppuqnqmsqocv',
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'vishal@pronteff.com', // sender address
                    to: `${request.employee_email}`, // list of receivers
                    subject: `Timesheet rejected
                   
                  
                  `,// Subject line
                    html: `
                    <table>
                    <tr>
                    <td><h2>Timesheet rejected</h2>
                    <p style="font-size:16px">Pronteff IT Solutions</p></td>
                    </tr>                 
                    <hr>                  
                    <tr>
                    <td><br><h2>${request.week_name}</h2>
                    <p style="font-size:22px">${request.employee_name}</p></td>
                    </tr>
                    <tr>
                    <td><br>Rejected by:<b>${request.rejected_by}</b><br>
                    <span>Note:<b>${request.note}</b></span>
                    
                    </td>
                    </tr>
                    </table>`
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
                    service: 'pronteff',
                    auth: {
                        user: 'vishal@pronteff.com',
                        pass: 'iufhppuqnqmsqocv',
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'vishal@pronteff.com', // sender address
                    to: `${request.employee_email}`, // list of receivers
                    subject: `Timesheet aprroved
                  
                  
                  `,// Subject line
                    html: `
                    <table>
                    <tr>
                    <td><h2>Timesheet approved</h2>
                    <p style="font-size:16px">Pronteff IT Solutions</p></td>
                    </tr>                 
                    <hr>                  
                    <tr>
                    <td><br><h2>${request.week_name}</h2>
                    <p style="font-size:22px">${request.employee_name}</p></td>
                    </tr>
                    <tr>
                    <td><br>Approved by:<b>${request.approved_by}</b></td>
                    </tr>
                    </table>`


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

        return firstMonth.concat("-" + lastMonth)
    }




    this.calculateWorkedHours = async function (data) {
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


    var start_time = "00:00:00";
    for (let i = 0; i < data.length; i++) {

    var times = [ 0, 0, 0 ]
  var max = times.length

  var a = (start_time || '').split(':')
  var b = (data[i].task_total_time || '').split(':')

  // normalize time values
  for (var i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
  }

  // store time values
  for (var i = 0; i < max; i++) {
    times[i] = a[i] + b[i]
  }

  var hours = times[0]
  var minutes = times[1]
  var seconds = times[2]

  if (seconds >= 60) {
    var m = (seconds / 60) << 0
    minutes += m
    seconds -= 60 * m
  }

  if (minutes >= 60) {
    var h = (minutes / 60) << 0
    hours += h
    minutes -= 60 * h
  }
}

finaladd = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
start_time = finaladd
}

return finaladd


}


module.exports = Util