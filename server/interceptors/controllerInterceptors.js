// const adminController = require('../controller/adminController');
// const adminServices = require('../services/adminService');

const validations = require('../utils/validations')

const projectController = require('../controller/projectController')
const projectService = require('../services/projectService')

const employeeController = require('../controller/employeeController')
const employeeService = require('../services/employeeService')


const rolesDepartmentDesignationContoller = require('../controller/rolesDepartmentDesignationContoller')
const rolesDepartmentDesignationService = require('../services/rolesDepartmentDesignationService')

const userController = require('../controller/userController')
const userService = require('../services/userService')

const timeTrackingController = require('../controller/timeTrackingController')
const timeTrackingService = require('../services/timeTrackingService')


const analyzeController = require('../controller/analyzeController')
const analyzeServices = require('../services/analyzeServices')


function ControllInterceptor(objCollection) {

    // new adminController(objCollection)
    // new adminServices(objCollection)

    new validations(objCollection)

    new projectController(objCollection)
    new projectService(objCollection)

    new employeeController(objCollection)
    new employeeService(objCollection)

    new rolesDepartmentDesignationContoller(objCollection)
    new rolesDepartmentDesignationService(objCollection)

    new userController(objCollection)
    new userService(objCollection)

    new timeTrackingController(objCollection)
    new timeTrackingService(objCollection)

    
    new analyzeController(objCollection)
    new analyzeServices(objCollection)
}



module.exports = ControllInterceptor;