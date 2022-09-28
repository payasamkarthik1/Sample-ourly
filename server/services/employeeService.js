
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
                request.department_id,
                request.designation_id,

                hashPassword,
                util.getCurrentUTCTime()
            );

            const queryString = util.getQueryString('employee_create_insert', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(0, queryString, request)
                    .then(async (data) => {
                        let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                        responseData = data1;
                        error = false;

                    })
                    .catch((err) => {
                        error = err;
                    })
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
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = util.getQueryString('employee_remove_employee_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                    error = false
                    responseData = data
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
            request.department_id,
            request.designation_id,

        );

        const queryString = util.getQueryString('employee_update_employee_details', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    error = false
                    responseData = data
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.getTeamLeads = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.team_lead_emplyee_id.toString()
        );

        const queryString = util.getQueryString('get_team_leads', paramsArr);

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



}



module.exports = AdminService;
