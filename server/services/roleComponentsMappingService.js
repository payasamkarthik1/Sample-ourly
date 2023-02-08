

const Validations = require('../utils/validations')
function RoleComponentsMappingService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)


    this.roleCreation = async function (request) {
        const [err, validation] = await validations.roleValidationAdd(request);
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
        const [err, validation] = await validations.roleValidationUpdate(request);
        if (!err) {
            await this.roleDelete(request, 1);
            const data = request.permission_data
            const addedDate = await util.getCurrentUTCTime()
            for (let i = 0; i < data.length; i++) {
                await this.rolePermissionsDataLoopForUpdate(request, data[i], addedDate, 2)
            }
            const [err1, data1] = await this.roleGet()
            return [err1, data1]
        } else {
            return [err, validation]
        }
    }

    this.roleUpdateInPermissions = async function (request) {
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
        }


    }

    this.roleDelete = async function (request, flag) {
        if (request.role_name == "Admin Access") {
            return [true, [{ message: "Admin role cannot be deleted" }]]
        } else {
            let responseData = [],
                error = true
            //flag =1 for update role delete it before
            //flag=2 for checking the role assign under emp or not then delete if not assgned
            const paramsArr = new Array(
                request.role_id.toString(),
                flag
            );
            const queryString = util.getQueryString('role_remove_delete', paramsArr);
            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        if (flag == 1) {
                            error = false
                        } else if (flag == 2) {
                            if (data[0].message === "deleted") {
                                const [err, data1] = await this.roleGet()
                                responseData = data1
                                error = false
                            } else {
                                responseData = [{ message: data[0].message }];
                            }
                        }
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }
        }

    }

    this.roleGet = async function (request) {
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

}


module.exports = RoleComponentsMappingService;
