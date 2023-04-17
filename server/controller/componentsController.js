const ComponentsService = require('../services/componentsService')

function Components(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const componentsService = new ComponentsService(objectCollection)


    //@Post component/add/insert
    app.post('/' + 'api/' +'component/add/insert',

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
    app.post('/' + 'api/' +'component/update',

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
    app.post('/' + 'api/' +'component/remove/inactive',

        async function (req, res) {

            const [err, resData] = await componentsService.componentRemoveInactive(req.body);
            if (!err) {
                console.log("omponent/remove/inactive | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("omponent/remove/inactive | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/remove/delete
    app.post('/' + 'api/' +'component/remove/delete',

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

    //@Post component/remove/inactive/to/active
    app.post('/' +'api/' + 'component/remove/inactive/to/active',

        async function (req, res) {

            const [err, resData] = await componentsService.componentInactiveToActive(req.body);
            if (!err) {
                console.log("component/remove/inactive/to/active | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/remove/inactive/to/active | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post component/get/list
    app.post('/' +'api/' + 'component/get/list',

        async function (req, res) {

            const [err, resData] = await componentsService.componentGetAll(req.body);
            if (!err) {
                console.log("component/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("component/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

}


module.exports = Components;
