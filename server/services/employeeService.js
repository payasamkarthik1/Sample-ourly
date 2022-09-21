
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

const RolesDepartmentDesignationService = require("../services/rolesDepartmentDesignationService");


function AdminService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)
    const rolesDepartDesigService = new RolesDepartmentDesignationService(objectCollection)



    this.employeeCreationInsert = async function (request) {
        let responseData = [],
            error = true;
        const [err, respData] = await validations.employeeCreationInputValidations(request);
        if (err) {
            return [err, respData];
        }
        else {
            const id = util.getRandomNumericId()
            const hashPassword = await util.convertTextToHash(request.password)
            const [err1, data1] = await rolesDepartDesigService.getRolesDepartDesignById(request, request.role_id, 1);
            const [err2, data2] = await rolesDepartDesigService.getRolesDepartDesignById(request, request.department_id, 2);
            const [err3, data3] = await rolesDepartDesigService.getRolesDepartDesignById(request, request.designation_id, 3);

            const paramsArr = new Array(
                id,
                request.first_name,
                request.last_name,
                request.email,
                request.gender,
                request.phone_number,
                request.blood_group,
                request.dob,
                request.role_id,
                data1[0].role_name,
                request.department_id,
                data2[0].department_name,
                request.designation_id,
                data3[0].designation_name,
                hashPassword,
                util.getCurrentUTCTime()
            );

            const queryString = util.getQueryString('employee_create_insert', paramsArr);

            if (queryString !== '') {
                await db.executeQuery(0, queryString, request)
                    .then(async (data) => {
                        let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                        responseData = data1;
                        error = false;

                    })
                    .catch((err) => {
                        error = err;
                    })
            }
        }
        return [error, responseData];
    }

    this.getAllEmployees = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(

        );

        const queryString = util.getQueryString('employee_get_all_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }


}



module.exports = AdminService;
