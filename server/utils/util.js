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

    this.getCurrentUTCTime = function (format) {
        let now = moment().utc().format(format || "YYYY-MM-DD HH:mm:ss");
        return now;
    }

    this.getTimeDiff = async function (request) {

        var startTime = moment(request.task_start_time, "HH:mm:ss a"),
            endTime = moment(request.task_end_time, "HH:mm:ss a");
        // var diff = moment.duration(endTime.diff(startTime));
        var hrs = moment.utc(endTime.diff(startTime)).format("HH");
        var min = moment.utc(endTime.diff(startTime)).format("mm");
        var sec = moment.utc(endTime.diff(startTime)).format("ss");
        return [hrs, min, sec].join(':')
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
            responseData = [error, { message: "token is required" }]
        }
        try {
            const data = await jwt.verify(token, global.config.sceret_key)
            if (data) {
                error = false,
                    responseData = data
            }
            else {
                error = true
                responseData = [error, { message: "token is invalid" }]
            }

        } catch (e) {
            error = true
            responseData = [error, { message: "token is invalid" }]
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
                    subject: 'Clockify Request', // Subject line
                    html: `<a href="http://192.168.0.217:3000/forgotpass">click to change password</a>`

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
            // return [error,responseData]
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

}

module.exports = Util