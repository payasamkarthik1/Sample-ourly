const RoleComponentsMappingService = require('./roleComponentsMappingService')

function RolePermissionEmployeeMapping(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const roleComponentsMappingService = new RoleComponentsMappingService(objectCollection)

    this.rolePermissionEmployeeAdd = async function (request) {
        console.log('---------------------entered rolePermissionEmployeeAdd-------------------------');
        await this.rolePermissionsEmployeeDataLoopForAdd(request, 1)
    }

    this.rolePermissionEmployeeUpdate = async function (request) {
        console.log('---------------------entered rolePermissionEmployeeUpdate-------------------------');
        await this.rolePermissionEmployeeDelete(request, 2)
        await this.rolePermissionsEmployeeDataLoopForUpdate(request, 2)
        const [err, data] = await roleComponentsMappingService.roleGet()
        return [err, data]
    }

    this.rolePermissionEmployeeDelete = async function (request, flag) {
        console.log('---------------------entered rolePermissionEmployeeDelete-------------------------');
        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.employee_id.toString(),
            0,
            0,
            flag
        );
        const queryString = util.getQueryString('role_permission_employee', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    const [err, data1] = await roleComponentsMappingService.roleGet()
                    console.log('============data=============')
                    console.log(data1F)
                    console.log('====================================')
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.rolePermissionsEmployeeDataLoopForAdd = async function (request, flag) {
        console.log('---------------------entered rolePermissionsEmployeeDataLoopForAdd-------------------------');
        const addedDate = await util.getCurrentUTCTime()
        const data1 = request.permission_data
        data1.map(async (item) => {
            paramsArr = new Array(
                request.employee_id,
                item.role_id,
                addedDate,
                flag
            )

            const queryString = util.getQueryString('role_permission_employee', paramsArr);

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
        })
    }

    this.rolePermissionsEmployeeDataLoopForUpdate = async function (request, flag) {
        console.log('---------------------entered rolePermissionsDataLoop-------------------------');
        const data = request.permission_data
        const addedDate = await util.getCurrentUTCTime()
        data.map(async (item) => {
            paramsArr = new Array(
                request.employee_id,
                item.role_id,
                addedDate,
                flag
            )

            const queryString = util.getQueryString('role_permission_employee', paramsArr);

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
        })

    }

    this.rolePermissionEmployeeget = async function (request, flag) {
        console.log('---------------------entered rolePermissionEmployeeget-------------------------');
        let responseData = []
        let time = [], manage = [], analyze = []
        error = true
        const paramsArr = new Array(
            request.employee_id.toString(),
            null,
            null,
            flag
        );
        const queryString = util.getQueryString('role_permission_employee', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    // if (request.is_admin == 1) {
                    //     const [err, data] = await componentsService.componentGetAll()
                    //     let components_ids = []

                    //     if (data.length != 0) {
                    //         await data.map((id) => {
                    //             components_ids.push(id.component_id)
                    //         })
                    //         for (let i = 0; i < components_ids.length; i++) {
                    //             if (components_ids[i] > 0 && components_ids[i] < 3) {
                    //                 time.push(components_ids[i])
                    //                 time.pop()
                    //             } else if (components_ids[i] > 2 && components_ids[i] < 5) {
                    //                 analyze.push(components_ids[i])
                    //             }
                    //             else {
                    //                 manage.push(components_ids[i])
                    //             }
                    //         }
                    //     }
                    // } else {

                    if (data.length != 0) {
                        let components_ids = []
                        await data.map((id) => {
                            components_ids.push(id.component_id)
                        })
                        var unique_components_ids = components_ids.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        })
                        for (let i = 0; i < unique_components_ids.length; i++) {
                            if (unique_components_ids[i] > 0 && unique_components_ids[i] < 3) {
                                time.push(unique_components_ids[i])
                            } else if (unique_components_ids[i] >= 3 && unique_components_ids[i] < 5) {
                                analyze.push(unique_components_ids[i])
                            }
                            else {
                                manage.push(unique_components_ids[i])
                            }
                        }

                    }
                    // }
                    responseData.push({ time: time.map(String) })
                    responseData.push({ manage: manage.map(String) })
                    responseData.push({ analyze: analyze.map(String) })
                    console.log('============data=================');
                    console.log(responseData);
                    console.log('====================================');
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })

            return [error, responseData];
        }
    }
}


module.exports = RolePermissionEmployeeMapping;
