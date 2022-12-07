const EmployeeService = require('./employeeService')


function Components(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;

    const employeeService = new EmployeeService(objectCollection)




    //--------------------component-------------------------------

    this.componentAdd = async function (request) {
        console.log('---------------------entered componentAdd-------------------------');

        let responseData = [],
            error = true

        //flag =1 is for tag_tyoe add
        flag = 1
        const paramsArr = new Array(
            request.component_name,
            util.getCurrentUTCTime(),
            flag
        );

        const queryString = util.getQueryString('component_add_remove_delete_get', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==========component_add_insert=============');
                    console.log(data);
                    console.log('====================================');
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

    this.componentUpdate = async function (request) {
        console.log('---------------------entered componentUpdate-------------------------');

        let responseData = [],
            error = true
        flag = 2
        const paramsArr = new Array(
            request.component_id.toString(),
            0,
            flag
        );

        const queryString = util.getQueryString('component_add_remove_delete_get', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.componentRemoveInactive = async function (request) {
        console.log('---------------------entered componentRemove-------------------------');

        let responseData = [],
            error = true
        flag = 3
        const paramsArr = new Array(
            request.component_id.toString(),
            0,
            flag
        );

        const queryString = util.getQueryString('component_add_remove_delete_get', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.componentRemoveDelete = async function (request) {
        console.log('---------------------entered componentRemove-------------------------');

        let responseData = [],
            error = true
        flag = 4
        const paramsArr = new Array(
            request.component_id.toString(),
            0,
            flag
        );

        const queryString = util.getQueryString('component_add_remove_delete_get', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.componentInactiveToActive = async function (request) {
        console.log('---------------------entered componentRemove-------------------------');

        let responseData = [],
            error = true
        flag = 5
        const paramsArr = new Array(
            request.component_id.toString(),
            0,
            flag
        );

        const queryString = util.getQueryString('component_add_remove_delete_get', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.componentGetAll = async function (request) {
        console.log('---------------------entered componentGetAll-------------------------');

        let responseData = [],
            error = true
        flag = 6
        const paramsArr = new Array(
            0,
            0,
            flag
        );

        const queryString = util.getQueryString('component_add_remove_delete_get', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==============component_add_remove_delete_get===============');
                    console.log(data);
                    console.log('====================================');
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


    //--------------------comoponet-permissions-------------------------------

    this.componentPermissionAdd = async function (request) {
        console.log('---------------------entered componentPermissionAdd-------------------------');

        let responseData = [],
            error = true

        const [err, data] = await employeeService.getEmployeeById(request)
        flag = 1
        const paramsArr = new Array(
            request.component_permission_id,
            request.component_id,
            request.employee_id,
            data[0].role_id,
            util.getCurrentUTCTime(),
            flag

        );

        const queryString = util.getQueryString('component_permissions', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('========tag_add_permissions_insert=============');
                    console.log(data);
                    console.log('====================================');
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

    this.componentPermissionUpdate = async function (request) {
        console.log('---------------------entered componentPermissionAdd-------------------------');

        let responseData = [],
            error = true

        const [err, data] = await employeeService.getEmployeeById(request)
        flag = 2
        const paramsArr = new Array(
            request.component_permission_id,
            0,
            0,
            0,
            util.getCurrentUTCTime(),
            flag

        );

        const queryString = util.getQueryString('component_permissions', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('========component_permissions=============');
                    console.log(data);
                    console.log('====================================');
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

    this.componentPermissionRemove = async function (request) {
        console.log('---------------------entered componentPermissionRemove-------------------------');

        let responseData = [],
            error = true
        flag = 3
        const paramsArr = new Array(
            request.component_permission_id,
            0,
            0,
            0,
            util.getCurrentUTCTime(),
            flag

        );

        const queryString = util.getQueryString('component_permissions', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
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

    this.componentPermissionGetByEmpId = async function (request) {
        console.log('---------------------entered componentPermissionGetByEmpId-------------------------');
        let responseData = [],
            error = true
        flag = 4
        const paramsArr = new Array(
            0,
            0,
            request.employee_id,
            0,
            0,
            flag
        );

        const queryString = util.getQueryString('component_permissions', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                    responseData = newArray;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }






}


module.exports = Components;
