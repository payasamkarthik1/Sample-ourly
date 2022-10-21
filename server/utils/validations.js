// const mysql = require('mysql');
// const moment = require('moment')
// //bcrypt
const bcrypt = require('bcrypt')


// var CryptoJS = require('crypto-js')
const Validator = require('validator')
const isEmpty = require('is-empty');
const { response } = require('express');


function Validations(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;


    this.employeeCreationInputValidations = async function (request) {

        let responseData = []

        if (Validator.isEmpty(request.first_name)) {
            error = true
            responseData = [error, { message: 'first_name  is required' }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.last_name)) {
            error = true

            responseData = [error, { message: 'last_name is required' }]
            return [true, responseData];

        } else if (Validator.isEmpty(request.email)) {
            error = true
            responseData = [error, { message: 'email is required' }]
            return [true, responseData];

        }
        else if (Validator.isEmpty(request.phone_number)) {
            error = true
            responseData = [error, { message: 'phone_number is required' }]
            return [true, responseData];
        }
        else if (!(request.phone_number.length == 10)) {
            error = true
            responseData = [error, { message: 'invalid phone_number' }]
            return [true, responseData];
        }
        else if (Validator.isEmpty(request.gender)) {
            error = true
            responseData = [error, { message: 'gender  is required' }]
            return [true, responseData];
        }
        else if (Validator.isEmpty(request.blood_group)) {
            error = true
            responseData = [error, { message: 'blood_group  is required' }]
            return [true, responseData];
        }
        else if (Validator.isEmpty(request.dob)) {
            error = true
            responseData = [error, { message: 'dob  is required' }]
            return [true, responseData];
        }
        else if (Validator.isEmpty(request.role_id.toString())) {
            error = true
            responseData = [error, { message: 'role  is required' }]
            return [true, responseData];
        }
        else if (Validator.isEmpty(request.department_id.toString())) {
            error = true
            responseData = [error, { message: 'department  is required' }]
            return [true, responseData];
        }
        else if (Validator.isEmpty(request.designation_id.toString())) {
            error = true
            responseData = [error, { message: 'designation  is required' }]
            return [true, responseData];
        }
        else if (Validator.isEmpty(request.password)) {
            error = true
            responseData = [error, { message: 'password is required' }]
            return [true, responseData];
        }
        else if (!(request.password.length >= 8)) {
            error = true
            responseData = [error, { message: 'password length must be minimum 8' }]
            return [true, responseData];
        }
        else if (!(request.password.length <= 15)) {
            error = true
            responseData = [error, { message: 'password length must be maximum 15' }]
            return [true, responseData];
        }
        else {
            error = false
            return [false, responseData];

        }


    }



    this.userLoginCheck = async function (request, res, next) {
        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.email,
        );
        const queryString = util.getQueryString('user_details_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    if (data.length == 0) {
                        error = true
                        responseData = [error, { "message": "no user found" }]
                    }
                    else {
                        error = false
                        responseData = data
                    }
                }).catch((err) => {
                    error = err;
                })
            return [error, responseData]
        }
    }


    this.userDetailsList = async function (request) {
        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.email,
        );
        const queryString = util.getQueryString('user_get_all_employees_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    if (data.length == 0) {
                        error = true
                        responseData = [error, { "message": "Invalid credentials" }]
                    }
                    else {

                        error = false
                        responseData = data

                    }
                }).catch((err) => {
                    error = err;
                })

            return [error, responseData]

        }
    }

    this.getEmployeeById = async function (id, request) {
        let responseData = [],
            error = true
        employee_id = id.toString()

        const paramsArr = new Array(
            employee_id
        );

        const queryString = util.getQueryString('employee_get_employee_by_id_select', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    error = true
                    responseData = data

                }).catch((err) => {
                    error = err;
                })

            return [error, responseData]

        }
    }

    this.userLoginChangePasswordCheck = async function (request, resData1) {
        let responseData = [],
            error = true
        emp_id = resData1.data[0].employee_id
        const [err, data] = await this.getEmployeeById(emp_id)
        await bcrypt
            .compare(request.old_password, data[0].password)
            .then(async (isMatch) => {
                if (isMatch) {

                    responseData = resData1
                    error = false
                }
                else {
                    responseData = [error, { message: "Incorrect password" }]
                }
            }).catch((err) => {
                error = err
            })
        return [error, responseData]


    }



    this.userLoginPasswordCheck = async function (request, resData1) {
        let responseData = [],
            error = true

        await bcrypt
            .compare(request.password, resData1[0].password)
            .then(async (isMatch) => {
                if (isMatch) {
                    responseData = resData1
                    error = false
                }
                else {
                    responseData = [error, { message: "Invalid credentials" }]
                }
            }).catch((err) => {
                error = err
            })
        return [error, responseData]


    }

    this.userLoggedInOrNotCheck = async function (request) {

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.email,
        );
        const queryString = util.getQueryString('user_get_login_details_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    if (data.length !== 0) {
                        flag = 2
                        error = false
                        responseData = flag

                        // }
                    } else {
                        flag = 1
                        error = false
                        responseData = flag
                    }
                }).catch((err) => {
                    error = err;
                })
            return [error, responseData]
        }
    }

    this.oldPasswordCheck = async function (request, req) {
        let responseData = [],
            error = true

        if (request.newPassword == " " || request.confirmPassword == " " || request.oldPassword == " ") {
            error = true
            responseData = [error, { message: "All fields are required" }]
        } else {
            const [err, data] = await util.verifyJwtToken(request, req);
            if (err) {
                error = true;
                responseData = data
            } else {
                const [err1, data1] = await this.userLoginChangePasswordCheck(request, data)
                if (err1) {
                    error = true
                    responseData = data1
                } else if (request.new_password !== request.confirm_password) {
                    error = true
                    responseData = [error, { message: "New password and Confirm password should be same" }]
                } else {
                    error = false
                    const hashNewPassword = await util.convertTextToHash(request.new_password)

                    const [err2, data2] = await this.changePasswordWithOldPasswordInsert(request, data, hashNewPassword)
                    if (!err2) {
                        error = false
                        responseData = data2
                    } else {
                        error = true
                        responseData = data2
                    }

                }
            }
        }
        return [error, responseData]

    }

    this.forgetChangePassword = async function (request) {
        let responseData = [],
            error = true
        if (request.new_password == " " || request.confirm_password == " " || request.new_password == "" || request.confirm_password == "") {
            error = true
            responseData = [error, { message: "All Fields are required" }]
        } else
            if (request.new_password !== request.confirm_password) {
                error = true
                responseData = [error, { message: "New password and Confirm password should be same" }]
            } else {
                error = false
                const [err, data] = await this.userDetailsList(request)
                if (!err) {
                    const hashNewPassword = await util.convertTextToHash(request.new_password)
                    await this.forgetPasswordChange(request, data, hashNewPassword)
                    responseData = [false, { message: "Password Changed Successfully" }]
                } else {
                    error = true
                    responseData = data
                }

            }
        return [error, responseData]

    }

    this.forgetPasswordChange = async function (request, data, hashNewPassword) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            data[0].employee_id,
            data[0].email,
            hashNewPassword
        )
        const queryString = util.getQueryString('user_password_change_update', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false

                }).catch((err) => {
                    error = err;
                })
            return [error, responseData];

        }

    }

    this.changePasswordWithOldPasswordInsert = async function (request, resData, hashNewPassword) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            resData.data[0].employee_id,
            resData.data[0].email,
            hashNewPassword
        )
        const queryString = util.getQueryString('user_password_change_update', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then((data) => {

                    error = false
                    responseData = [error, { message: "Password Changed Successfully" }]

                }).catch((err) => {
                    error = err;
                })
            return [error, responseData];

        }

    }

    this.createProjectValidations = async function (request) {
        let responseData = [],
            error = true
        if (request.newPassword || request.confirmPassword == "") {
            error = true
            responseData = [error, { message: "s are required" }]
        } else if (request.newPassword !== request.confirmPassword) {
            error = true
            responseData = [error, { message: "mismatch" }]
        } else {
            error = false
            responseData = [error, { message: "changed" }]

        }
        return [error, responseData]

    }


}
module.exports = Validations