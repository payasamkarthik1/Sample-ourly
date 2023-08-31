

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

                    for (let i = 0; i <= data1.length - 1; i++) {

                        let [err1, res1] = await this.getRatingByskill_id(data1[i].skill_id);

                        if (res1.length === 0) {
                            data[i].flag = 0;//flag =0 no rating was added to the skill
                        }
                        else {
                            data[i].flag = 1;//flag =1 rating was added to the skill
                        }
                    }

                    responseData = data1;
                    error = false;
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
            request.employee_name
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

    this.getRatingByskill_id = async function (skill_id) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            skill_id.toString(),
        );
        const queryString = util.getQueryString('skills_get_rating_by_skill_id', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, skill_id)
                .then(async (data) => {

                    responseData = data;
                    error = false;

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }


}


module.exports = skillService;
