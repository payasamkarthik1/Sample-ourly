const TagCreationService = require('../services/tagCreationService')

function TagCreations(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper

    const tagCreationService = new TagCreationService(objectCollection)



    //--------------------tag-type-------------------------------

    //@Post tag/add/tag_type/insert
    app.post('/' + 'tag/add/tag_type/insert',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagTypeAdd(req.body);
            if (!err) {
                console.log("tag/add/tag_type/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("tag/add/tag_type/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post tag/tag_type/update
    app.post('/' + 'tag/tag_type/update',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagTypeUpdate(req.body);
            if (!err) {
                console.log("tag/tag_type/update | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("tag/tag_type/update | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post tag/remove/tag_type/delete
    app.post('/' + 'tag/remove/tag_type/delete',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagTypeRemove(req.body);
            if (!err) {
                console.log("tag/remove/tag_type/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("tag/remove/tag_type/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post tag/tag_type/list/select
    app.post('/' + 'tag/get/tag_type/list',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagTypeGetAll(req.body);
            if (!err) {
                console.log("tag/get/tag_type/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("tag/get/tag_type/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //--------------------tag-category-------------------------------
    //@Post tag/add/tag_category/insert
    app.post('/' + 'tag/add/tag_category/insert',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagCategoryAdd(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post ttag/remove/tag_category/delete
    app.post('/' + 'tag/tag_category/update',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.getApprovalsList(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post ttag/remove/tag_category/delete
    app.post('/' + 'tag/remove/tag_category/delete',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.getApprovalsList(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post tag/get/tag_category/select
    app.post('/' + 'tag/get/tag_category/select',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagCategoryGetAll(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //--------------------tag-mapping-------------------------------

    //@Post tag/mapping/add
    app.post('/' + 'tag/mapping/add',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagMappingAdd(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post tag/mapping/delete
    app.post('/' + 'tag/mapping/delete',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagMappingRemove(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post tag/mapping/get
    app.post('/' + 'tag/mapping/get',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagMappingGet(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



    //--------------------tag-Permissions-------------------------------

    //@Post tag/mapping/add
    app.post('/' + 'tag/permissions/add',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagPermissionAdd(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post tag/mapping/delete
    app.post('/' + 'tag/mapping/delete',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagMappingRemove(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post tag/mapping/get
    app.post('/' + 'tag/permission/get',

        async function (req, res) {

            const [err, resData] = await tagCreationService.tagPermissionGet(req.body);
            if (!err) {
                console.log("tag/permission/get | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("tag/permission/get | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })







}


module.exports = TagCreations;
