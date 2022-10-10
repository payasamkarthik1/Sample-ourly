const { json } = require("body-parser");
const AdminServices = require("../services/adminService");
const Validations = require('../utils/validations')



function AdminController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const adminServices = new AdminServices(objectCollection)
    const validations = new Validations(objectCollection)


    //@Post analyze/get/report/filter/by/client
    app.post('/' + 'holidays/add/upload/list',

         async function (req, res) {

             const [err, resData] = await adminServices.addHolidaysUploadList(req.body);
             if (!err) {
                 console.log("analyze/get/report/filter/by/client | Error: ", err);
                 res.json(responseWrapper.getResponse({}, resData, 200, req.body));
             } else {
                 console.log("analyze/get/report/filter/by/client | Error: ", err);
                 res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
         }
        })

}


module.exports = AdminController;
