const RolePermissionEmployeeMapping = require('../services/rolePermissionEmployeeMappingService')
const RoleComponentsMappingService = require('../services/roleComponentsMappingService')

function RoleComponentsMapping(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const roleComponentsMappingService = new RoleComponentsMappingService(objectCollection)
    const rolePermissionEmployeeMapping = new RolePermissionEmployeeMapping(objectCollection)

    //@Post role/add/insert
    app.post('/' + 'api/' + 'role/add/insert',

        async function (req, res) {

            const [err, resData] = await roleComponentsMappingService.roleCreation(req.body);
            if (!err) {
                console.log("role/add/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/add/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post role/delete
    app.post('/' + 'api/' + 'role/delete',

        async function (req, res) {

            const [err, resData] = await roleComponentsMappingService.roleDelete(req.body,2);
            if (!err) {
                console.log("role/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post role/update
    app.post('/' + 'api/' + 'role/update',

        async function (req, res) {

            const [err, resData] = await roleComponentsMappingService.roleUpdate(req.body);
            if (!err) {
                console.log("role/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post role/get
    app.get('/' + 'api/' + 'role/get',

        async function (req, res) {

            const [err, resData] = await roleComponentsMappingService.roleGet(req.body);
            if (!err) {
                console.log("role/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

}


module.exports = RoleComponentsMapping;
