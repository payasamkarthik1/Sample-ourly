

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
            request.status_changed_datetime,
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
                    // const [err, resp] = await leadService.getEmployessAssignUnderHeads(request, 1)
                    // console.log('=================getEmployessAssignUnderHeads==================')
                    // console.log(resp)
                    // console.log('====================================')
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
