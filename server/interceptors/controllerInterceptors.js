const validations = require('../utils/validations')

const projectController = require('../controller/projectController')
const projectService = require('../services/projectService')

const employeeController = require('../controller/employeeController')
const employeeService = require('../services/employeeService')

const DepartmentDesignationContoller = require('../controller/departmentDesignationContoller')
const DepartmentDesignationsService = require('../services/departmentDesignationService')

const userController = require('../controller/userController')
const userService = require('../services/userService')

const timeTrackingController = require('../controller/timeTrackingController')
const timeTrackingService = require('../services/timeTrackingService')

const analyzeController = require('../controller/analyzeController')
const analyzeServices = require('../services/analyzeServices')

const holidayListController = require('../controller/HolidaysListController')
const holidaysListService = require('../services/HolidaysListService')

const approvalsController = require('../controller/approvalsController')

const leadController = require('../controller/leadController')
const leadService = require('../services/leadService')

const componentsController = require('../controller/componentsController')
const componentsService = require('../services/componentsService')

const RoleComponentsMappingController = require('../controller/roleComponentsMappingController')
const RoleComponentsMappingService = require('../services/roleComponentsMappingService')


const projectbasedapprovalController = require('../controller/projectbasedapprovalController')
const projectbasedapprovalServices = require('../services/projectbasedapprovalServices')

const RolePermissionEmployeeMapping = require('../services/roleComponentsMappingService')

const Scheduler = require('../utils/sheduler')


function ControllInterceptor(objCollection) {

    new validations(objCollection)

    new projectController(objCollection)
    new projectService(objCollection)

    new projectbasedapprovalController(objCollection)
    new projectbasedapprovalServices(objCollection)

    new employeeController(objCollection)
    new employeeService(objCollection)

    new DepartmentDesignationContoller(objCollection)
    new DepartmentDesignationsService(objCollection)

    new userController(objCollection)
    new userService(objCollection)

    new timeTrackingController(objCollection)
    new timeTrackingService(objCollection)

    new timeTrackingController(objCollection)
    new timeTrackingService(objCollection)

    new analyzeController(objCollection)
    new analyzeServices(objCollection)

    new holidayListController(objCollection)
    new holidaysListService(objCollection)

    new approvalsController(objCollection)

    new leadController(objCollection)
    new leadService(objCollection)

    new componentsController(objCollection)
    new componentsService(objCollection)

    new RoleComponentsMappingController(objCollection)
    new RoleComponentsMappingService(objCollection)

    new RolePermissionEmployeeMapping(objCollection)
    
    new Scheduler(objCollection)
}



module.exports = ControllInterceptor;