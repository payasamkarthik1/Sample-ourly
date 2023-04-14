
const ProjectbasedapprovalServices = require("../services/projectbasedapprovalServices");

function ProjectController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const projectbasedapprovalServices = new ProjectbasedapprovalServices(objectCollection)

    //@Post get/project/wise/task/details
    app.post('/' + 'get/project/wise/task/details', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getProjectWiseTaskDetails(req.body, res);
        if (!err) {
            console.log("get/project/wise/task/details | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/project/wise/task/details | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

}


module.exports = ProjectController;
