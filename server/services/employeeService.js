
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')
const RolePermissionEmployeeMapping = require('./rolePermissionEmployeeMappingService')

function EmployeeServices(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)
    const rolePermissionEmployeeMapping = new RolePermissionEmployeeMapping(objectCollection)


    this.employeeCreationInsert = async function (request) {
        let responseData = [],
            error = true;
        const [err, respData] = await validations.employeeCreationInputValidations(request);
        if (err) {
            return [err, respData];
        }
        else {
            const hashPassword = await util.convertTextToHash(request.password)
            const paramsArr = new Array(
                util.getRandomNumericId(),
                request.first_name,
                request.last_name,
                request.email,
                request.gender,
                request.phone_number,
                request.blood_group,
                request.dob,
                request.lead_assigned_employee_id,
                request.department_id,
                request.designation_id,
                hashPassword,
                util.getCurrentUTCTime()
            );

            const queryString = util.getQueryString('employee_create_insert', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(0, queryString, request)
                    .then(async (data) => {
                        if (data[0].message === "EMAIL ALREADY EXIST") {
                            error = true
                            responseData = [{ message: data[0].message }];
                        } else if (data[0].message === "PHONENUMBER ALREADY EXIST") {
                            error = true
                            responseData = [{ message: data[0].message }];
                        } else if (data[0].message === "data") {
                            //adding role perimissions to user
                            console.log('===============xsxsx============')
                            console.log(data)
                            console.log('====================================')
                            request.employee_id = data[0].employee_id
                            await rolePermissionEmployeeMapping.rolePermissionEmployeeAdd(request)
                            let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                            responseData = data1;
                            error = false;
                        }

                    })
                    .catch((err) => {
                        error = err;
                    })
                return [error, responseData];
            }
        }
        return [error, responseData];
    }

    this.getAllEmployees = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('employee_get_all_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    console.log('======employee==================')
                    console.log(data1)
                    console.log('====================================')

                    var dat = data1.reduce(function (acc, curr) {
                        //finding Index in the array where the NamaCategory matched
                        var findIfNameExist = acc.findIndex(function (item) {
                            return item.employee_id === curr.employee_id;
                        })
                        if (findIfNameExist === -1) {

                            let obj = {
                                'employee_id': curr.employee_id,
                                'first_name': curr.first_name,
                                'last_name': curr.last_name,
                                'full_name': curr.full_name,
                                'email': curr.email,
                                'phone_number': curr.phone_number,
                                'blood_group': curr.blood_group,
                                'dob': curr.dob,
                                'gender': curr.gender,
                                'designation_name': curr.designation_name,
                                'department_name': curr.department_name,
                                'lead_assigned_employee_id': curr.lead_assigned_employee_id,
                                'log_state': curr.log_state,
                                "permission_data": [
                                    {
                                        'role_id': curr.role_id,
                                        'role_name': curr.role_name,
                                    }]
                            }
                            acc.push(obj)
                        } else {
                            acc[findIfNameExist].permission_data.push({
                                'role_id': curr.role_id,
                                'role_name': curr.role_name,
                            })
                        }

                        return acc;

                    }, []);

                    responseData = dat;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.getEmployeeById = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = util.getQueryString('employee_get_employee_by_id_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.removeEmployeeDelete = async function (request) {

        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.employee_id.toString(),
            flag
        );

        const queryString = util.getQueryString('employee_remove_employee_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.removeEmployeeComplete = async function (request) {

        let responseData = [],
            error = true;
        flag = 2
        const paramsArr = new Array(
            request.employee_id,
            flag
        );

        const queryString = util.getQueryString('employee_remove_employee_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    await rolePermissionEmployeeMapping.rolePermissionEmployeeDelete(request)
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.inactiveEmpToActive = async function (request) {

        let responseData = [],
            error = true;
        flag = 3
        const paramsArr = new Array(
            request.employee_id,
            flag
        );

        const queryString = util.getQueryString('employee_remove_employee_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1
                    error = false
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.updateEmployeeDetails = async function (request) {
        let responseData = [],
            error = true;
        const [err, respData] = await validations.employeeUpdateCreationInputValidations(request);
        if (err) {
            error = err
            responseData = respData
        } else {

            const paramsArr = new Array(
                request.employee_id,
                request.first_name,
                request.last_name,
                request.email,
                request.gender,
                request.phone_number,
                request.blood_group,
                request.dob,
                request.image,
                request.lead_assigned_employee_id,
                request.department_id,
                request.designation_id,
            );

            const queryString = util.getQueryString('employee_update_employee_details', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        error = false
                        await rolePermissionEmployeeMapping.rolePermissionEmployeeUpdate(request)
                        let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                        responseData = data1
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })

            }

        }
        return [error, responseData];
    }


}



module.exports = EmployeeServices;
