
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

function RolesDepartmentDesignationsService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)


    this.roleCreateInsert = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.role_name,
            util.getCurrentUTCTime()

        );

        const queryString = util.getQueryString('role_create_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }
    this.departmentInsert = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.department_name,
            util.getCurrentUTCTime()

        );

        const queryString = util.getQueryString('department_add_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }
    this.designationInsert = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.designation_name,
            util.getCurrentUTCTime()

        );


        const queryString = util.getQueryString('designation_add_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }
    this.getAllRoles = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('role_get_all_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    error = err
                })
            return [error, responseData];
        }
    }
    this.getAllDepartments = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(

        );

        const queryString = util.getQueryString('department_get_all_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }
    this.getAllDesignations = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(

        );

        const queryString = util.getQueryString('designation_get_all_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }
    this.getRolesDepartDesignById = async function (request, id, flag) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            id,
            flag
        );

        const queryString = util.getQueryString('role_depart_designa_get_by_id_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }
    this.getAllRolesDepartDesign = async function (request) {

        let responseData = [];
        error = false
        const [err1, resData1] = await this.getAllRoles()
        const [err2, resData2] = await this.getAllDepartments()
        const [err3, resData3] = await this.getAllDesignations()

        responseData.push(resData1)
        responseData.push(resData2)
        responseData.push(resData3)
        console.log('====================================')
        console.log(responseData)
        console.log('====================================')

        return [false, responseData]
    }


}



module.exports = RolesDepartmentDesignationsService;
