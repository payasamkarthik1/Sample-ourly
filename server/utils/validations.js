// const mysql = require('mysql');

const bcrypt = require('bcrypt')
const Validator = require('validator')

function Validations(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;

    this.employeeCreationInputValidations = async function (request) {

        let responseData = []

        if (Validator.isEmpty(request.first_name)) {
            error = true
            responseData = [{ message: 'first_name  is required' }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.last_name)) {
            error = true
            responseData = [{ message: 'last_name is required' }]
            return [error, responseData];

        } else if (Validator.isEmpty(request.email)) {
            error = true
            responseData = [{ message: 'email is required' }]
            return [error, responseData];

        }
        else if (Validator.isEmpty(request.phone_number)) {
            error = true
            responseData = [{ message: 'phone_number is required' }]
            return [error, responseData];
        }
        else if (!(request.phone_number.length == 10)) {
            error = true
            responseData = [{ message: 'invalid phone_number' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.gender)) {
            error = true
            responseData = [{ message: 'gender  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.blood_group)) {
            error = true
            responseData = [{ message: 'blood_group  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.dob)) {
            error = true
            responseData = [{ message: 'dob  is required' }]
            return [error, responseData];
        }
        else if (request.permission_data.length == 0) {
            error = true
            responseData = [{ message: 'permission is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.department_id.toString())) {
            error = true
            responseData = [{ message: 'department  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.designation_id.toString())) {
            error = true
            responseData = [{ message: 'designation  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.password)) {
            error = true
            responseData = [{ message: 'password is required' }]
            return [error, responseData];
        }
        else if (!(request.password.length >= 8)) {
            error = true
            responseData = [{ message: 'password length must be minimum 8' }]
            return [error, responseData];
        }
        else if (!(request.password.length <= 15)) {
            error = true
            responseData = [{ message: 'password length must be maximum 15' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];

        }


    }

    this.employeeUpdateCreationInputValidations = async function (request) {

        let responseData = []

        if (Validator.isEmpty(request.first_name)) {
            error = true
            responseData = [{ message: 'first_name  is required' }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.last_name)) {
            error = true
            responseData = [{ message: 'last_name is required' }]
            return [error, responseData];

        } else if (Validator.isEmpty(request.email)) {
            error = true
            responseData = [{ message: 'email is required' }]
            return [error, responseData];

        }
        else if (Validator.isEmpty(request.phone_number)) {
            error = true
            responseData = [{ message: 'phone_number is required' }]
            return [error, responseData];
        }
        else if (!(request.phone_number.length == 10)) {
            error = true
            responseData = [{ message: 'invalid phone_number' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.gender)) {
            error = true
            responseData = [{ message: 'gender  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.blood_group)) {
            error = true
            responseData = [{ message: 'blood_group  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.dob)) {
            error = true
            responseData = [{ message: 'dob  is required' }]
            return [error, responseData];
        }

        else if (Validator.isEmpty(request.department_id.toString())) {
            error = true
            responseData = [{ message: 'department  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.designation_id.toString())) {
            error = true
            responseData = [{ message: 'designation  is required' }]
            return [error, responseData];
        }
        else if (request.permission_data.length == 0) {
            error = true
            responseData = [{ message: 'permission is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.lead_assigned_employee_id.toString())) {
            error = true
            responseData = [{ message: 'lead_assigned_employee_id  is required' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];

        }


    }

    this.userProfileValidation = async function (request) {

        let responseData = []
        if (Validator.isEmpty(request.phone_number)) {
            error = true
            responseData = [{ message: 'phone_number is required' }]
            return [error, responseData];
        }
        else if (!(request.phone_number.length == 10)) {
            error = true
            responseData = [{ message: 'invalid phone_number' }]
            return [error, responseData];
        }

        else {
            error = false
            return [error, responseData];

        }


    }

    this.addClientValidation = async function (request) {

        let responseData = []

        str = request.client_name
        l = str.trimLeft()
        r = str.trimRight()

        if (Validator.isEmpty(request.client_name)) {
            error = true
            responseData = [{ message: 'Client name is required' }]
            return [error, responseData];
        }
        else if (l != str || r != str) {
            error = true
            responseData = [{ message: 'Client name contains white spaces' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];

        }


    }

    this.addDepartmentValidation = async function (request) {

        let responseData = []

        str = request.department_name
        l = str.trimLeft()
        r = str.trimRight()

        if (Validator.isEmpty(request.department_name)) {
            error = true
            responseData = [{ message: 'Department_name is required' }]
            return [error, responseData];
        }
        else if (l != str || r != str) {
            error = true
            responseData = [{ message: 'Department name contains white spaces' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];
        }
    }

    this.userLoginValidation = async function (request) {
        let responseData = []

        str = request.email
        l = str.trimLeft()
        r = str.trimRight()

        if (Validator.isEmpty(request.email)) {
            error = true
            responseData = [{ message: 'Email is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.password)) {
            error = true
            responseData = [{ message: 'Password is required' }]
            return [error, responseData];
        }
        else if (l != str || r != str) {
            error = true
            responseData = [{ message: 'Email contains white spaces' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];
        }
    }

    this.addDesignationValidation = async function (request) {

        let responseData = []

        str = request.designation_name
        l = str.trimLeft()
        r = str.trimRight()
        if (Validator.isEmpty(request.department_id.toString())) {
            error = true
            responseData = [{ message: 'Department is required' }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.designation_name)) {
            error = true
            responseData = [{ message: 'Designation name is required' }]
            return [error, responseData];
        }
        else if (l != str || r != str) {
            error = true
            responseData = [{ message: 'Designation name contains white spaces' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];

        }


    }

    this.addProjectToClientValidation = async function (request) {

        let responseData = []

        str = request.project_name
        l = str.trimLeft()
        r = str.trimRight()
        if (Validator.isEmpty(request.client_id.toString())) {
            error = true
            responseData = [{ message: 'Client  is required' }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.project_name)) {
            error = true
            responseData = [{ message: 'Project name is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.project_code)) {
            error = true
            responseData = [{ message: 'Project code is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.project_color_code)) {
            error = true
            responseData = [{ message: 'Project color code is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.tag_id.toString())) {
            error = true
            responseData = [{ message: "tag is required" }]
            return [true, responseData];
        }
        else if (l != str || r != str) {
            error = true
            responseData = [{ message: 'Project name contains white spaces' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];

        }


    }

    this.roleValidationUpdate = async function (request) {

        let responseData = []

        str = request.role_name
        l = str.trimLeft()
        r = str.trimRight()

        if (l != str || r != str) {
            error = true
            responseData = [{ message: 'role name contains white spaces' }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.role_name)) {
            error = true
            responseData = [{ message: 'rolename is required' }]
        } else if (request.role_name == "Admin Access") {
            error = true
            responseData = [{ message: 'Admin role cannot be updated' }]
        }
        else if (request.role_name) {
            const [err, data] = await this.roleNameValidChk(request, 2)

            if (data[0].cnt > 0) {
                error = true
                responseData = [{ message: 'role name already exist' }]
            } else {
                error = false
            }
        }
        return [error, responseData];



    }

    this.roleValidationAdd = async function (request) {

        let responseData = []

        str = request.role_name
        l = str.trimLeft()
        r = str.trimRight()

        if (l != str || r != str) {
            error = true
            responseData = [{ message: 'role name contains white spaces' }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.role_name)) {
            error = true
            responseData = [{ message: 'rolename is required' }]
        } else if (request.role_name) {
            const [err, data] = await this.roleNameValidChk(request, 1)
            if (data[0].cnt > 0) {
                error = true
                responseData = [{ message: 'role name already exist' }]
            } else {
                error = false
            }
        }
        return [error, responseData];



    }

    this.roleNameValidChk = async function (request, flag) {
        let responseData = []
        error = true
        let paramsArr = new Array(
            request.role_id,
            request.role_name,
            flag
        )
        const queryString = util.getQueryString('role_name_check_validation', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData]
        }

    }

    this.updateProjectToClientValidation = async function (request) {

        let responseData = []

        str = request.project_name
        l = str.trimLeft()
        r = str.trimRight()
        if (Validator.isEmpty(request.client_id.toString())) {
            error = true
            responseData = [{ message: 'Client  is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.project_id.toString())) {
            error = true
            responseData = [{ message: 'Project id is required' }]
            return [error, responseData];
        }

        else if (Validator.isEmpty(request.project_name)) {
            error = true
            responseData = [{ message: 'Project name is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.project_code)) {
            error = true
            responseData = [{ message: 'Project code is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.project_color_code)) {
            error = true
            responseData = [{ message: 'Project color code is required' }]
            return [error, responseData];
        }
        else if (Validator.isEmpty(request.tag_id.toString())) {
            error = true
            responseData = [{ message: "tag is required" }]
            return [true, responseData];
        }
        else if (l != str || r != str) {
            error = true
            responseData = [{ message: 'Project name contains white spaces' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];

        }


    }

    this.addOnRejectValidation = async function (request) {

        let responseData = []
        if (Validator.isEmpty(request.note)) {
            error = true
            responseData = [{ message: 'Note  is required' }]
            return [error, responseData];
        }
        else {
            error = false
            return [error, responseData];

        }


    }

    this.taskCreationInputValidation = async function (request) {

        let responseData = []

        if (Validator.isEmpty(request.task_description)) {
            error = true
            responseData = [{ message: "This entry can't be saved, please add description" }]
            return [error, responseData];
        } else if (Validator.isEmpty(request.project_id.toString())) {
            error = true
            responseData = [{ message: "This entry can't be saved, please add project" }]
            return [true, responseData];

        } else if (Validator.isEmpty(request.task_start_time)) {
            error = true
            responseData = [{ message: "This entry can't be saved, please add start time" }]
            return [true, responseData];

        }
        else if (Validator.isEmpty(request.task_end_time)) {
            error = true
            responseData = [{ message: "This entry can't be saved, please add end time" }]
            return [true, responseData];
        }

        else if (Validator.isEmpty(request.task_created_datetime)) {
            error = true
            responseData = [{ message: "This entry can't be saved, please add date" }]
            return [true, responseData];
        }

        else {
            error = false
            return [false, responseData];

        }


    }

    this.userDetailsList = async function (request) {
        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.email,
        );
        const queryString = util.getQueryString('user_get_usr_by_email', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    if (data.length == 0) {
                        error = true
                        responseData = [{ "message": "Invalid credentials" }]
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
                    error = true
                    responseData = [{ message: "Old Password is Incorrect" }]
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

    this.oldPasswordCheck = async function (request, req) {
        let responseData = [],
            error = true

        if (request.newPassword == " " || request.confirmPassword == " " || request.oldPassword == " ") {
            error = true
            responseData = [{ message: "All fields are required" }]
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
                }
                else if (!(request.new_password.length >= 8)) {
                    error = true
                    responseData = [{ message: 'password length must be minimum 8' }]
                    return [error, responseData];
                }
                else if (!(request.new_password.length <= 15)) {
                    error = true
                    responseData = [{ message: 'password length must be maximum 15' }]
                    return [error, responseData];
                }
                else if (request.new_password !== request.confirm_password) {
                    error = true
                    responseData = [{ message: "New password and Confirm password should be same" }]
                }
                else if(request.old_password === request.new_password&& request.old_password === request.confirm_password){
                    error = true
                    responseData = [{message: "Password Already Exists Try Different One"}]
                }
                else {
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
                return [error, responseData]
            }
        }
        return [error, responseData]

    }

    this.forgetChangePassword = async function (request) {
        let responseData = [],
            error = true



        str = request.new_password
        l = str.trimLeft()
        r = str.trimRight()


        if (request.new_password == "" || request.confirm_password == "" || request.email == "") {
            error = true
            responseData = [{ message: "All Fields are required" }]

        } else if (l != str || r != str) {
            error = true
            responseData = [{ message: 'Password contains white spaces' }]
            return [error, responseData];
        }
        else if (!(request.new_password.length >= 8 && request.new_password.length <= 15)) {
            error = true
            responseData = [{ message: 'Password length must be between 8 - 15 characters' }]
            return [error, responseData];
        }
        else if (request.new_password !== request.confirm_password) {
            error = true
            responseData = [{ message: "New password and Confirm password should be same" }]
        } else {
            error = false
            const [err, data] = await this.userDetailsList(request)
            if (!err) {
                const isMatch = await bcrypt.compare(request.new_password, data[0].password)
                if (isMatch) {
                    error = true
                    responseData = [{ message: "password already exists" }]
                } else {
                    const hashNewPassword = await util.convertTextToHash(request.new_password)
                    await this.forgetPasswordChange(request, data, hashNewPassword)
                    error = false
                    responseData = [{ message: "Password Changed Successfully" }]
                }
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
                    responseData = [{ message: "Password Changed Successfully" }]

                }).catch((err) => {
                    error = err;
                })
            return [error, responseData];

        }

    }

    this.addForgetPasswordDetails = async function (request) {
        console.log("============addForgetPasswordDetails======================")
        let responseData = [],
            error = true;
        const status = 1;//status 1 means link is active
        const flag = 1;// flag=1 means insert forget_password details
        const paramsArr = new Array(
            util.getRandomUniqueId(),
            request.email,
            util.getCurrentUTCTime(),
            status,
            flag
        )
        const queryString = util.getQueryString('forget_password_add_forget_password_details', paramsArr);

        if (queryString !== '') {

            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false;
                }).catch((err) => {
                    console.log('error-----', err);
                    error = err;
                })
            return [error, responseData]
        }
    }

    this.UpdateForgetPasswordDetails = async function (request) {
        console.log("============UpdateForgetPasswordDetails======================")
        let responseData = [],
            error = true;
        const status = 2;//status 2 means link is inactive
        const flag = 2;// flag=2 means update forget_password details
        const paramsArr = new Array(
            request.unique_code,
            request.time,
            status,
            flag
        )
        const queryString = util.getQueryString('forget_password_update_forget_password_details', paramsArr);

        if (queryString !== '') {

            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false;
                }).catch((err) => {
                    console.log('error-----', err);
                    error = err;
                })
            return [error, responseData]
        }
    }

    this.UserForgetPasswordLinkExpireCheck = async function (request) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            request.unique_code.toString(),
        )

        const queryString = util.getQueryString('forget_password_get_time_by_select_unique_code', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                    const currentTime = util.getCurrentUTCTime();
                    const linkSentTime = data[0].time;
                    const timeDiff = await util.getMinutesBetweenTwoDates(linkSentTime, currentTime);

                    if (timeDiff <= 10) {
                        responseData = [{ message: "session is active" }]
                        error = false;
                    } else {
                        await this.UpdateForgetPasswordDetails(request);
                        responseData = [{ message: "session was expired" }]
                        error = true;
                    }

                }).catch((err) => {
                    console.log("error-----", err);
                    error = err;
                })
            return [error, responseData]
        }

    }

}
module.exports = Validations