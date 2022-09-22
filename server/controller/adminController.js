const { json } = require("body-parser");
const AdminServices = require("../services/adminService");
const Validations = require('../utils/validations')



function AdminController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const adminServices = new AdminServices(objectCollection)
    const validations = new Validations(objectCollection)


}


module.exports = AdminController;
