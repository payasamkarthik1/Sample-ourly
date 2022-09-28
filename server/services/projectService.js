
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

function ProjectService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)



    this.removeClientDelete = async function (request) {

        let responseData = [],
            error = true;
        const [err, data] = await this.getProjectsByClientidSelect(request)
        if (data.length == 0) {
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.client_id.toString()
            );
            const queryString = util.getQueryString('project_remove_client_delete', paramsArr);

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
        } else {
            responseData = [error, { "message": "Client cannot be deleted" }]
            return [error, responseData];
        }


    }
    this.getAllClientsSelect = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(

        );

        const queryString = util.getQueryString('project_get_all_clients_select', paramsArr);

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
    this.addClientInsert = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_name,
            util.getCurrentUTCTime(),

        );

        const queryString = util.getQueryString('project_add_client_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    console.log('=========addClientInsert=============')
                    console.log(data)
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
    this.updateClientDetails = async function (request) {

        const [err, data] = await this.getClientByClientidSelect(request)
        if (!err) {

            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.client_id,
                request.client_name
            );

            const queryString = util.getQueryString('project_update_client_details', paramsArr);
            if (queryString !== '') {
                await db.executeQuery(1, queryString, request)
                    .then(async (data) => {
                        let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                        console.log('=========updateClientDetails===========')
                        console.log(data1)
                        console.log('====================================')
                        responseData = data1;
                        error = false
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
                return [error, responseData];
            }
        } else {
            return [err, data];
        }
    }


    this.getProjectsByClientidSelect = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_id.toString()
        );

        const queryString = util.getQueryString('project_get_projects_by_clientid_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=========getProjectsByClientidSelect==============')
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
    this.getClientByClientidSelect = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_id.toString()
        );

        const queryString = util.getQueryString('project_get_clients_by_clientid_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data.length == 0) {
                        error = true
                        responseData = [{ message: "Invalid Client id" }]
                    } else {
                        console.log('============getClientByClientidSelect=================')
                        console.log(data)
                        console.log('====================================')
                        responseData = data;
                        error = false
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    this.addProjectsToClientInsert = async function (request) {

        const [err, data] = await this.getClientByClientidSelect(request)
        if (!err) {
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.client_id,
                util.getRandomNumericId(),
                request.project_name,
                request.project_color_code,
                request.tag_id,
                util.getCurrentUTCTime(),
            );
            const queryString = util.getQueryString('project_add_projects_to_client_insert', paramsArr);

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
        } else {
            return [err, data];
        }


    }
    this.updateProjectDetails = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_id,
            request.project_id,
            request.project_name,
            request.project_color_code,
            request.tag_id,
        );


        const queryString = util.getQueryString('project_update_project_details', paramsArr);

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
    this.removeProjectDelete = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.project_id.toString(),
        );


        const queryString = util.getQueryString('project_remove_project_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    console.log('=========removeProjectDelete===========')
                    console.log(data)
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
    this.getAllProjectsSelect = async function (request) {

        let responseData = [],
            error = true;


        const paramsArr = new Array(

        );
        const queryString = util.getQueryString('project_get_all_projects_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    console.log('==========getAllProjectsSelect=============')
                    console.log(data)
                    console.log('====================================')
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    error = err
                })
            return [error, responseData];
        }




    }


    this.getAllTagsSelect = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(

        );

        const queryString = util.getQueryString('project_get_all_tags_select', paramsArr);

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

    this.addTagsInsert = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.tag_name,
            util.getCurrentUTCTime()
        );

        const queryString = util.getQueryString('project_add_tag_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    console.log('====================================')
                    console.log(data)
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

    this.updateTagDetails = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.tag_id,
            request.tag_name
        );

        const queryString = util.getQueryString('project_update_tag_details', paramsArr);

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

    this.removeTagDelete = async function (request) {

        const [err, data] = await this.getProjectsByTagidSelect(request)
        if (!err) {
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                request.tag_id.toString()
            );

            const queryString = util.getQueryString('project_remove_tag_delete', paramsArr);

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
        } else {
            return [err, data];
        }
    }

    this.getProjectsByTagidSelect = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.tag_id.toString()
        );

        const queryString = util.getQueryString('project_get_projects_by_tagid_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data.length == 0) {
                        console.log('============getProjectsByTagidSelect=================')
                        console.log(data)
                        console.log('====================================')
                        responseData = data;
                        error = false
                    } else {
                      
                            error = true
                            responseData = [{ message: "Tag cannot be deleted" }]
                        }
                    
                    }).catch((err) => {
                        console.log("err-------" + err);
                        error = err
                    })
            return [error, responseData];
        }
    }



}



module.exports = ProjectService;
