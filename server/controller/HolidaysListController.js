
const HolidaysListService = require('../services/HolidaysListService')

function HolidayListController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const holidaysListService = new HolidaysListService(objectCollection)

    //@Post holidays/get/all/list
    app.get('/' + 'holidays/get/all/list', async function (req, res) {
        const [err, resData] = await holidaysListService.getHolidayslistSelect(req.body, res);
        if (!err) {
            console.log("holidays/get/all/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("holidays/get/all/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )

    //@Post holidays/add/upload/list 
    app.post('/' + 'holidays/add/upload/list', async function (req, res) {
        console.log("enterr");
        const [err, resData] = await holidaysListService.addHolidaysList(req.body, res);
        if (!err) {
            console.log("holidays/add/upload/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("holidays/add/upload/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )

    //@Post holidays/remove/list/delete
    app.post('/' + 'holidays/remove/list/delete', async function (req, res) {
        const [err, resData] = await holidaysListService.removeHolidayListDelete(req.body, res);
        if (!err) {
            console.log("holidays/remove/list/delete | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("holidays/remove/list/delete | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )
}




module.exports = HolidayListController;
