

function skillService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;

    this.insertSkills = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_name,
            request.department_id,
            request.department_name,
            request.employee_id,
            request.employee_name,
            util.getCurrentUTCTime(),
        );

        const queryString = util.getQueryString('skills_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data[0].message === "Already skill exist") {
                        responseData = [{ message: data[0].message }]
                        error = true
                    } else {
                        responseData = data;
                        error = false
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

    this.getAllSkills = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('skills_get_all_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    const data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.updateSkillById = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_id,
            request.skill_name,
            request.department_id,
            request.department_name,
            request.employee_id,
            request.employee_name,
        );
        const queryString = util.getQueryString('skills_update_skill_by_id', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (data[0].message === "Already skill exist") {
                        responseData = [{ message: " Alerady skill was assigned to an employee " }]
                        error = true
                    } else {
                        responseData = data;
                        error = false
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.deleteSkillById = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_id.toString(),
        );
        const queryString = util.getQueryString('skills_delete_skill_by_id', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('===============deleteSkillById====================')
                    console.log(data)
                    console.log('====================================')
                    if (data[0].message === "Already skill exist") {
                        responseData = [{ message:"Assigned skill can not be deleted" }]
                        error = true
                    } else {
                        responseData = data;
                        error = false
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

}


module.exports = skillService;
