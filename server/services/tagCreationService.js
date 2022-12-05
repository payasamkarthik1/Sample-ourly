const EmployeeService = require('./employeeService')


function TagCreations(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;

    const employeeService = new EmployeeService(objectCollection)




    //--------------------tag-type-------------------------------

    this.tagTypeAdd = async function (request) {
        console.log('---------------------entered tagTypeAdd-------------------------');

        let responseData = [],
            error = true

        //flag =1 is for tag_tyoe add
        flag = 1
        const paramsArr = new Array(
            request.tag_type_name,
            util.getCurrentUTCTime(),
            flag
        );

        const queryString = util.getQueryString('tag_creation', paramsArr);

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

    this.tagTypeUpdate = async function (request) {
        console.log('---------------------entered tagTypeUpdate-------------------------');

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.tag_type_id.toString()
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    this.tagTypeRemove = async function (request) {
        console.log('---------------------entered tagTypeRemove-------------------------');

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.tag_type_id.toString()
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    this.tagTypeGetAll = async function (request) {
        console.log('---------------------entered tagTypeGetAll-------------------------');

        let responseData = [],
            error = true
        flag = 1
        const paramsArr = new Array(
            flag.toString()
        );

        const queryString = util.getQueryString('tag_get_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==============tag_get_list===============');
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







    //--------------------tag-catrgory-------------------------------

    this.tagCategoryAdd = async function (request) {
        console.log('---------------------entered tagCategoryAdd-------------------------');

        let responseData = [],
            error = true
        //flag =2 is for tag_tyoe add
        flag = 2
        const paramsArr = new Array(
            request.tag_category_name,
            util.getCurrentUTCTime(),
            flag
        );

        const queryString = util.getQueryString('tag_creation', paramsArr);

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

    this.tagCategoryUpdate = async function (request) {
        console.log('---------------------entered tagCategoryUpdate-------------------------');

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.tag_catgeory_id.toString()
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    this.tagCategoryRemove = async function (request) {
        console.log('---------------------entered tagCategoryRemove-------------------------');

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.tag_category_id.toString()
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    this.tagCategoryGetAll = async function (request) {
        console.log('---------------------entered tagCategoryGetAll-------------------------');

        let responseData = [],
            error = true
        flag = 2
        const paramsArr = new Array(
            flag.toString()
        );

        const queryString = util.getQueryString('tag_get_list', paramsArr);

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








    //--------------------tag-mapping-------------------------------

    this.tagMappingAdd = async function (request) {
        console.log('---------------------entered tagMappingAdd-------------------------');

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.tag_category_id,
            request.tag_type_id,
            util.getCurrentUTCTime(),
            1
        );

        const queryString = util.getQueryString('tag_mapping', paramsArr);

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

    this.tagMappingRemove = async function (request) {
        console.log('---------------------entered tagMappingRemove-------------------------');

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.tag_mapping_id.toString()
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    this.tagMappingGet = async function (request) {
        console.log('---------------------entered tagMappingGet-------------------------');

        let responseData = [],
            error = true
        flag = 3
        const paramsArr = new Array(
            flag.toString()
        );

        const queryString = util.getQueryString('tag_get_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');


                    var newArray = data.reduce(function (acc, curr) {
                        //finding Index in the array where the NamaCategory matched
                        var findIfNameExist = acc.findIndex(function (item) {
                            return item.tag_category_name === curr.tag_category_name;
                        })
                        if (findIfNameExist === -1) {

                            let obj = {
                                'tag_category_name': curr.tag_category_name,
                                'tag_category_id': curr.tag_category_id,
                                "value": [curr]
                            }
                            acc.push(obj)
                        } else {
                            acc[findIfNameExist].value.push(curr)
                        }

                        return acc;

                    }, []);

                    responseData = newArray;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }








    //--------------------tag-permissions-------------------------------

    this.tagPermissionAdd = async function (request) {
        console.log('---------------------entered tagPermissionAdd-------------------------');

        let responseData = [],
            error = true


        const [err, data] = await employeeService.getEmployeeById(request)
        console.log('====================================')
        console.log(data)
        console.log('====================================')
        const paramsArr = new Array(
            request.tag_category_id,
            request.employee_id,
            data[0].role_id,
            util.getCurrentUTCTime(),

        );

        const queryString = util.getQueryString('tag_add_permissions_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('========tag_add_permissions_insert=============');
                    console.log(data);
                    console.log('====================================');
                    // const data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.tagMappingRemove = async function (request) {
        console.log('---------------------entered tagMappingRemove-------------------------');

        let responseData = [],
            error = true
        const paramsArr = new Array(
            request.tag_mapping_id.toString()
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    this.tagPermissionGet = async function (request) {
        console.log('---------------------entered tagMappingGet-------------------------');

        let responseData = [],
            error = true
        flag = 4
        const paramsArr = new Array(
            flag.toString()
        );

        const queryString = util.getQueryString('tag_get_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');



                    var newArray = data.reduce(function (acc, curr) {
                        //finding Index in the array where the NamaCategory matched
                        var findIfNameExist = acc.findIndex(function (item) {
                            return item.employee_id === curr.employee_id;
                        })
                        if (findIfNameExist === -1) {

                            let obj = {
                                'employee_id': curr.employee_id,
                                'employee_name': curr.employee_name,
                                'role_id': curr.role_id,
                                'role_name': curr.role_name,
                                'tag_category_id': curr.tag_category_id,
                                'tag_category_name': curr.tag_category_name,
                                "value": [{
                                    tag_type_id: curr.tag_type_id,
                                    tag_type_name: curr.tag_type_name
                                }]
                            }
                            acc.push(obj)
                        } else {
                            acc[findIfNameExist].value.push({ tag_type_id: curr.tag_type_id, tag_type_name: curr.tag_type_name })
                        }

                        return acc;

                    }, []);

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


module.exports = TagCreations;
