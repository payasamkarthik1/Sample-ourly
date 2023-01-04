

const Validations = require('../utils/validations')
function RoleComponentsMappingService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)



    this.roleCreation = async function (request) {
        console.log('---------------------entered roleCreation-------------------------');
        const [err, validation] = await validations.roleValidation(request);
        if (!err) {
            const data = request.permission_data
            const addedDate = await util.getCurrentUTCTime()
            const role_id = await util.generateRandtoken()
            for (let i = 0; i < data.length; i++) {
                await this.rolePermissionsDataLoopForAdd(request, data[i], role_id, addedDate, 1)
            }
            const [err1, data1] = await this.roleGet()
            return [err1, data1]
        } else {
            return [err, validation]
        }

    }

    this.roleUpdate = async function (request) {
        console.log('---------------------entered roleUpdate-------------------------');
        await this.roleDelete(request);
        const [err, validation] = await validations.roleValidation(request);
        if (!err) {
            const data = request.permission_data
            const addedDate = await util.getCurrentUTCTime()
            for (let i = 0; i < data.length; i++) {
                await this.rolePermissionsDataLoopForUpdate(request, data[i], addedDate, 2)
            }
            // await this.roleUpdateInPermissions(request)
            const [err1, data1] = await this.roleGet()
            return [err1, data1]
        } else {
            return [err, validation]
        }
    }

    this.roleUpdateInPermissions = async function (request) {
        console.log('---------------------entered roleUpdateInPermissions-------------------------');
        //for updating rolename in role permission
        flag = 4
        let paramsArr = new Array(
            0,
            request.role_id,
            request.role_name,
            flag
        )

        const queryString = util.getQueryString('role_permission_employee', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.rolePermissionsDataLoopForAdd = async function (request, item, role_id, addedDate, flag) {

        console.log('---------------------entered rolePermissionsDataLoopForAdd-------------------------');

        let responseData = []
        let error = []

        let paramsArr = new Array(
            role_id,
            request.role_name,
            item.component_id,
            addedDate,
            flag
        )
        const queryString = util.getQueryString('role_create_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData]
        }

    }

    this.rolePermissionsDataLoopForUpdate = async function (request, item, addedDate, flag) {
        console.log('---------------------entered rolePermissionsDataLoopForUpdate-------------------------');
        let paramsArr = new Array(
            request.role_id,
            request.role_name,
            item.component_id,
            addedDate,
            flag
        )

        const queryString = util.getQueryString('role_create_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            // return [error, responseData];
        }


    }

    this.roleDelete = async function (request) {
        console.log('---------------------entered roleDelete-------------------------');
        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.role_id.toString(),
        );
        const queryString = util.getQueryString('role_remove_delete', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    const [err, data1] = await this.roleGet()
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    // this.roleUpdate = async function (request) {
    //     await this.roleDelete(request)
    //     await this.rolePermissionsDataLoopForUpdate(request, 2)
    //     const [err, data] = await this.roleGet()
    //     return [err, data]
    // }

    this.roleGet = async function (request) {
        console.log('---------------------entered roleGet-------------------------');
        let responseData = [],
            error = true
        const paramsArr = new Array(
        );
        const queryString = util.getQueryString('role_get_all_select', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    var data1 = data.reduce(function (acc, curr) {
                        //finding Index in the array where the NamaCategory matched
                        var findIfNameExist = acc.findIndex(function (item) {
                            return item.role_id === curr.role_id;
                        })
                        if (findIfNameExist === -1) {

                            let obj = {
                                'role_name': curr.role_name,
                                'role_id': curr.role_id,
                                "value": [

                                    { component_id: curr.component_id, component_name: curr.component_name }]
                            }
                            acc.push(obj)
                        } else {
                            acc[findIfNameExist].value.push({ component_id: curr.component_id, component_name: curr.component_name })
                        }

                        return acc;

                    }, []);
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.roleGetByEmpId = async function (request) {
        console.log('---------------------entered roleGet-------------------------');
        let responseData = [],
            error = true
        const paramsArr = new Array(
        );
        const queryString = util.getQueryString('role_get_all_select', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    var data1 = data.reduce(function (acc, curr) {
                        //finding Index in the array where the NamaCategory matched
                        var findIfNameExist = acc.findIndex(function (item) {
                            return item.role_id === curr.role_id;
                        })
                        if (findIfNameExist === -1) {
                            let obj = {
                                'role_name': curr.role_name,
                                'role_id': curr.role_id,
                                "value": [
                                    { component_id: curr.component_id, component_name: curr.component_name }]
                            }
                            acc.push(obj)
                        } else {
                            acc[findIfNameExist].value.push({ component_id: curr.component_id, component_name: curr.component_name })
                        }

                        return acc;

                    }, []);
                    responseData = data1;
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








}


module.exports = RoleComponentsMappingService;
