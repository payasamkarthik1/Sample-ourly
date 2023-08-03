

const LeadService = require('../services/leadService')

function skillEmployeeMappingService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const leadService = new LeadService(objectCollection)

    this.skillEmpMappInsert = async function (request) {
        console.log('====================================')
        console.log("enetrd")
        console.log('====================================')
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.from_employee_lead_id,
            request.employee_id,
            request.send_to_employee_id,
            request.skill_id,
            request.rating,
            request.from_employee_lead_note,
            request.send_to_employee_note,
            request.status_id,
            util.getCurrentUTCTime(),
        );

        const queryString = util.getQueryString('skill_emp_mapp_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_insert=====================')
                    console.log(data)
                    console.log('====================================')
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

    this.skillEmpMappUpdateStatusApproved = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_employee_mapping_id,
            request.send_to_employee_note,
            request.rating,
            util.getCurrentUTCTime(),
            1
        );

        const queryString = util.getQueryString('skill_emp_mapp_update', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_update=====================')
                    console.log(data)
                    console.log('====================================')
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }


    this.skillEmpMappUpdateStatusRejected = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_employee_mapping_id,
            request.send_to_employee_note,
            null,
            util.getCurrentUTCTime(),
            2
        );

        const queryString = util.getQueryString('skill_emp_mapp_update', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_update=====================')
                    console.log(data)
                    console.log('====================================')
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

    this.skillEmpMappGetEmpsUnderLeadSkillList = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.lead_employee_id.toString(),
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_emps_under_lead_skill_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    request.employee_id = request.lead_employee_id;
                    const [err, resp] = await leadService.getEmployessAssignUnderHeads(request, 1)
                    console.log('=================getEmployessAssignUnderHeads==================')
                    console.log(resp)
                    console.log('====================================')

                    console.log('=============skill_emp_mapp_get_emps_under_lead=====================')
                    console.log(data)
                    console.log('====================================')

                    function mergeArraysByEmployeeId(arr1, arr2) {
                        arr1.forEach((obj1) => {
                            const matchingObjects = arr2.filter((obj2) => obj1.employee_id === obj2.employee_id);

                            if (matchingObjects.length > 0) {
                                // Merge the objects if a match is found and add the "details" object as an array
                                obj1.skill_details = matchingObjects;
                            } else {
                                // Add an empty "details" array if no match is found
                                obj1.skill_details = [];
                            }
                        });
                    }
                    await mergeArraysByEmployeeId(resp, data)
                    responseData = resp;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

    this.skillEmpMappGetAllEmpsSkillList = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_all_emps_skill_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_get_emps_under_lead=====================')
                    console.log(data)
                    console.log('====================================')
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }



    this.skillEmpMappGetSkillSubmittedToEmp = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_skills_sumitted_to_emp', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_get_skills_sumitted_to_emp=====================')
                    console.log(data)
                    console.log('====================================')
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

}


module.exports = skillEmployeeMappingService;
