
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

const RolesDepartmentDesignationService = require("../services/rolesDepartmentDesignationService");


function AdminService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)
    const rolesDepartDesigService = new RolesDepartmentDesignationService(objectCollection)



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
                request.role_id,
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
                    responseData = data1;
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
                request.role_id,
                request.lead_assigned_employee_id,
                request.department_id,
                request.designation_id,
            );

            const queryString = util.getQueryString('employee_update_employee_details', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        error = false
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

    this.addEmployeesUnderLeads = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.role_id,
            request.team_lead_employee_id,
            request.employee_id,
            util.getCurrentUTCTime()
        );

        const queryString = util.getQueryString('lead_add_employees_under_lead', paramsArr);

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

    this.getAllLeads = async function (request) {

        let responseData = [],
            error = true;
        // if flag = 2 get all leads at create employee form
        flag = 2
        const paramsArr = new Array(
            0,
            flag
        );

        const queryString = util.getQueryString('get_leads', paramsArr);

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


    this.getEmpsAssignUnderLeads = async function (request) {

        let responseData = [],
            error = true;
        groups = []
        // if flag = 3 get all employess under admin and superlead
        // if flag = 4 get all employess under lead and emerging lead

        if (request.role_id == 2 || request.role_id == 5) {
            flag = 3
        } else if (request.role_id == 4) {
            flag = 4
        } else if (request.role_id == 6) {
            flag = 4
        }

        const paramsArr = new Array(
            request.lead_assigned_employee_id,
            flag
        );

        const queryString = util.getQueryString('get_leads', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (request.role_id == 2 || request.role_id == 5) {
                        //get grpups for admin and superlead
                        const [err1, data1] = await this.getGroupsUnderLeads(request, 5)
                        if (data1.length != 0) {
                            groups = data1
                            data.push({ groups })
                        }
                    }
                    else if (request.role_id == 4) {
                        obj1 = []
                        obj2 = []
                        let arr1 = []
                        data.filter(function (data1) {
                            if (data1.role_id == 3) {
                                obj1.push(data1)
                            } else if (data1.role_id == 6) {
                                obj2.push(data1)
                            }
                        })

                        if (obj2.length != 0) {
                            for (let i = 0; i < obj2.length; i++) {
                                request.employee_id = obj2[i].employee_id
                                const [err1, data1] = await this.getEmpsUnderEmergingLead(request)
                                Array.prototype.push.apply(arr1, data1);
                            }
                            Array.prototype.push.apply(obj1, arr1);
                            Array.prototype.push.apply(obj1, obj2);
                            console.log('=========getEmpsUnderEmergingLead================')
                            console.log(obj1)
                            console.log('====================================')

                        }
                        data = obj1;
                        error = false

                        const [err1, data1] = await this.getGroupsUnderLeads(request, 6)
                        if (data1.length != 0) {
                            groups = data1
                            data.push({ groups })
                        }
                    }


                    responseData = data
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.getEmpsAssignUnderLeadsWithoutGroups = async function (request) {

        let responseData = [],
            error = true;
        groups = []
        // if flag = 3 get all employess under admin and superlead
        // if flag = 4 get all employess under lead and emerging lead

        if (request.role_id == 2 || request.role_id == 5) {
            flag = 3
        } else if (request.role_id == 4) {
            flag = 4
        } else if (request.role_id == 6) {
            flag = 4
        }

        const paramsArr = new Array(
            request.lead_assigned_employee_id,
            flag
        );

        const queryString = util.getQueryString('get_leads', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                    if (request.role_id == 4) {
                        obj1 = []
                        obj2 = []
                        let arr1 = []
                        data.filter(function (data1) {
                            if (data1.role_id == 3) {
                                obj1.push(data1)
                            } else if (data1.role_id == 6) {
                                obj2.push(data1)
                            }
                        })
                        console.log('====object1=====================')
                        console.log(obj1)
                        console.log('====================================')

                        console.log('====object2=====================')
                        console.log(obj2)
                        console.log('====================================')


                        if (obj2.length != 0) {
                            for (let i = 0; i < obj2.length; i++) {
                                request.employee_id = obj2[i].employee_id
                                console.log("merging" + obj2[i].employee_id);
                                request.employee_id = obj2[i].employee_id
                                const [err1, data1] = await this.getEmpsUnderEmergingLead(request)
                                Array.prototype.push.apply(arr1, data1);
                            }
                            console.log('=========getEmpsUnderEmergingLead================')
                            console.log(arr1)
                            console.log('====================================')

                            Array.prototype.push.apply(obj1, arr1);
                            Array.prototype.push.apply(obj1, obj2);


                        }
                        data = obj1;
                        error = false


                    }
                    console.log('=====66666666666666666666666666666666666666666666666666666666666===')
                    console.log(data)
                    console.log('====================================')
                    responseData = data
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.getEmpsUnderEmergingLead = async function (request) {

        let responseData = [],
            error = true;
        flag = 4
        const paramsArr = new Array(
            request.employee_id,
            flag
        );

        const queryString = util.getQueryString('get_leads', paramsArr);

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

    this.getGroupsUnderLeads = async function (request, flag) {

        let responseData = [],
            error = true;
        // get groups for admina(flag=5) and lead(flag=6)
        const paramsArr = new Array(
            request.lead_assigned_employee_id,
            flag
        );

        const queryString = util.getQueryString('get_leads', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==========GROUPS========')
                    console.log(data)
                    console.log('====================================')
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }



}



module.exports = AdminService;
