

const SkillService = require('../services/skillServices')
function skillController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const skillService = new SkillService(objectCollection)

    //@Post skill/insert/skills
    app.post('/' + 'api/' + 'skill/insert/skills',
        async function (req, res) {

            const [err, resData] = await skillService.insertSkills(req.body, 1);
            if (!err) {
                console.log("skill/insert/skills | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/insert/skills | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Get skill/get/all/skills/list
    app.get('/' + 'api/' + 'skill/get/all/skills/list', async function (req, res) {
        const [err, resData] = await skillService.getAllSkills(req.body);
        if (!err) {
            console.log("skill/get/all/skills/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("skill/get/all/skills/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })


    //@Post skill/update/skills/by/id
    app.post('/' + 'api/' + 'skill/update/skills/by/id',

        async function (req, res) {
            const [err, resData] = await skillService.updateSkillById(req.body, 2);
            if (!err) {
                console.log("skill/update/skills/by/id | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/update/skills/by/id| Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post skill/delete/skill/by/id
    app.post('/' + 'api/' + 'skill/delete/skill/by/id',

        async function (req, res) {
            const [err, resData] = await skillService.deleteSkillById(req.body, 2);
            if (!err) {
                console.log("skill/delete/skill/by/id | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/delete/skill/by/id| Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Get skill/get/all/skills/list/by/check/rating
    app.get('/' + 'api/' + 'skill/get/all/skills/list/by/check/rating', async function (req, res) {
        const [err, resData] = await skillService.getAllSkillsByCheckTheRating(req.body);
        if (!err) {
            console.log(" skill/get/all/skills/list/by/check/rating | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("s skill/get/all/skills/list/by/check/rating | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

}




module.exports = skillController;
