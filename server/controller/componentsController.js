const ComponentsService = require('../services/componentsService')

function Components(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper

    const componentsService = new ComponentsService(objectCollection)



    //--------------------component-------------------------------

    //@Post component/add/insert
    app.post('/' + 'component/add/insert',

        async function (req, res) {

            const [err, resData] = await componentsService.componentAdd(req.body);
            if (!err) {
                console.log("component/add/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/add/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/update
    app.post('/' + 'component/update',

        async function (req, res) {

            const [err, resData] = await componentsService.componentUpdate(req.body);
            if (!err) {
                console.log("component/update | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/update | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/remove/inactive
    app.post('/' + 'component/remove/inactive',

        async function (req, res) {

            const [err, resData] = await componentsService.componentRemoveInactive(req.body);
            if (!err) {
                console.log("component/remove/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/remove/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/remove/delete
    app.post('/' + 'component/remove/delete',

        async function (req, res) {

            const [err, resData] = await componentsService.componentRemoveDelete(req.body);
            if (!err) {
                console.log("component/remove/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/remove/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/inactive/to/active
    app.post('/' + 'component/remove/inactive/to/active',

        async function (req, res) {

            const [err, resData] = await componentsService.componentInactiveToActive(req.body);
            if (!err) {
                console.log("component/remove/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/remove/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/get/list
    app.post('/' + 'component/get/list',

        async function (req, res) {

            const [err, resData] = await componentsService.componentGetAll(req.body);
            if (!err) {
                console.log("tag/get/tag_type/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("tag/get/tag_type/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })




    //--------------------component-Permissions-------------------------------

    //@Post component/permissions/add
    app.post('/' + 'component/permissions/add',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagPermissionAdd(req.body);
            if (!err) {
                console.log("component/permissions/add | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/permissions/add | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/permissions/remove
    app.post('/' + 'component/permissions/remove',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagMappingRemove(req.body);
            if (!err) {
                console.log("component/permissions/remove | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/permissions/remove | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post ccomponent/permissions/get/by/empid
    app.post('/' + 'component/permissions/get/by/empid',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagPermissionGet(req.body);
            if (!err) {
                console.log("component/permissions/get/by/empid | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/permissions/get/by/empid | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })







}


module.exports = Components;
