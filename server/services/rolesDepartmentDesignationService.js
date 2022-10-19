
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
                .then(async(data) => {
                    const data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
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
                .then(async(data) => {
    
                    const data1 = await util.addUniqueIndexesToArrayOfObject(data)
       
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.addDesignByDepartId = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.designation_name,
            request.department_id,
            util.getCurrentUTCTime()

        );


        const queryString = util.getQueryString('designation_add_by_depart_id_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async(data) => {
                    const data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.getDesignByDepartId = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.department_id.toString()
        );

        const queryString = util.getQueryString('designation_get_all_by_depart_id_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async(data) => {
                    const data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    error = err
                })
            return [error, responseData];
        }
    }

    this.getAllDesign = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('designation_get_all_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async(data) => {
                    const data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    error = err
                })
            return [error, responseData];
        }
    }






}



module.exports = RolesDepartmentDesignationsService;
