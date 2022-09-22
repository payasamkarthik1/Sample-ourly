
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

function ProjectService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)



    this.addClientInsert = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            util.getRandomNumericId(),
            request.client_name,
            util.getCurrentUTCTime(),

        );


        const queryString = util.getQueryString('project_create_client_insert', paramsArr);

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

    this.addProjectsInsert = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_id,
            util.getRandomNumericId(),
            request.project_name,
            request.project_color_code,
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
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    error = err
                })
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
            util.getRandomNumericId(),
            request.tag_name,
            util.getCurrentUTCTime()
        );

        const queryString = util.getQueryString('project_create_tag_insert', paramsArr);

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


}



module.exports = ProjectService;
