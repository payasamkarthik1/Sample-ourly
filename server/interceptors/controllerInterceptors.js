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

const adminController = require('../controller/adminController')
const adminService = require('../services/adminService')

const holidayListController = require('../controller/HolidaysListController')
const holidaysListService = require('../services/HolidaysListService')


const approvalsController = require('../controller/approvalsController')
const approvalsService = require('../services/approvalsService')


function ControllInterceptor(objCollection) {

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

    new timeTrackingController(objCollection)
    new timeTrackingService(objCollection)

    new analyzeController(objCollection)
    new analyzeServices(objCollection)

    new adminController(objCollection)
    new adminService(objCollection)

    new holidayListController(objCollection)
    new holidaysListService(objCollection)

    new approvalsController(objCollection)
    new approvalsService(objCollection)
}



module.exports = ControllInterceptor;