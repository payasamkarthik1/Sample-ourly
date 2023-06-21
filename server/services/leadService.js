
const EmployeeService = require('./employeeService')

function LeadService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const employeeService = new EmployeeService(objectCollection)

    //get emps under admin and employee
    this.getEmployessAssignUnderHeadsAdminAndEmpl = async function (request, flag) {
        var users = [], groups = [], dataRepeat = []
        if (request.role_id == 2) {
            const [err, data] = await employeeService.getAllEmployees()
            if (data.length != 0) {
                dataRepeat = data
                do {
                    data1 = await this.seperationUsersAndHeads(dataRepeat, request, users, groups)
                    dataRepeat = data1
                } while (dataRepeat.length != 0)

                if (users.length != 0) {
                    const uniqueids = [];
                    const uniqueEmps = users.filter(element => {
                        const isDuplicate = uniqueids.includes(element.employee_id);
                        if (!isDuplicate) {
                            uniqueids.push(element.employee_id);
                            return true;
                        }
                        return false;
                    });
                    users = uniqueEmps
                }
                if (groups.length != 0) {
                    const uniqueids = [];
                    const uniqueEmps = groups.filter(element => {
                        const isDuplicate = uniqueids.includes(element.employee_id);
                        if (!isDuplicate) {
                            uniqueids.push(element.employee_id);
                            return true;
                        }
                        return false;
                    });
                    groups = uniqueEmps

                }
            }
        }
        else {
            var data = await this.getEmpsUnderHeadsLevel1(request)
            if (data.length != 0) {
                dataRepeat = data
                do {
                    data1 = await this.seperationUsersAndHeads(dataRepeat, request, users, groups)
                    dataRepeat = data1
                } while (dataRepeat.length != 0)
            }
        }
        //flag 1 to get only users
        //flag 2  to get users and groups
        if (flag == 1) {
            return [false, users]
        } else {
            if (groups.length != 0) {
                groups.map((item) => {
                    item.lead_assigned_head = item.lead_assigned_employee_id;
                    delete item.lead_assigned_employee_id;
                    item.lead_assigned_employee_id = item.employee_id;
                })

            }
            users.sort((a, b) => a.first_name.localeCompare(b.first_name))
            groups.sort((a, b) => a.full_name.localeCompare(b.full_name))
            return [false, [{ users, groups }]]
        }
    }

    //get emps under  employee not for admin
    this.getEmployessAssignUnderHeads = async function (request, flag) {
        var users = [], groups = [], dataRepeat = []
        var data = await this.getEmpsUnderHeadsLevel1(request)
        if (data.length != 0) {
            dataRepeat = data
            do {
                data1 = await this.seperationUsersAndHeads(dataRepeat, request, users, groups)
                dataRepeat = data1
            } while (dataRepeat.length != 0)
        }
        //flag 1 to get only users
        //flag 2  to get users and groups
        if (flag == 1) {
            return [false, users]
        } else {
            if (groups.length != 0) {
                groups.map((item) => {
                    item.lead_assigned_head = item.lead_assigned_employee_id;
                    delete item.lead_assigned_employee_id;
                    item.lead_assigned_employee_id = item.employee_id;
                })

            }
            return [false, [{ users, groups }]]
        }
    }

    this.seperationUsersAndHeads = async function (data, request, users, groups) {
        let empsUnder = []
        for (let j = 0; j < data.length; j++) {
            request.employee_id = data[j].employee_id
            var data1 = await this.getEmpsUnderHeadsLevel1(request)
            if (data1.length != 0) {
                if (data[j].email !== "admin@pronteff.com") {
                    users.push(data[j])
                    Array.prototype.push.apply(empsUnder, data1);
                    groups.push(data[j])
                }
            } else {
                if (data[j].email !== "admin@pronteff.com") {
                    users.push(data[j])
                }

            }
        }
        return empsUnder
    }

    this.getEmpsUnderHeadsLevel1 = async function (request) {
        let responseData = []

        const paramsArr = new Array(
            request.employee_id.toString(),
        );

        const queryString = util.getQueryString('heads_get_emps_under_heads', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return responseData
        }


    };

    this.getLeadApprovalProjectEntriesData = async function (request, data) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            request.employee_id,
            data.project_id,
            request.first_week_day,
            request.last_week_day,
            request.role_id || 0
        );

        const queryString = util.getQueryString('get_lead_approval_project_entries', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, paramsArr)
                .then(async (res) => {

                    if (res.length > 0) {
                        for (let i of res) {
                            // i.project_lead_name = data.first_name;
                            if (i.status_id == 5) {
                                i.status_id = 2
                            } else if (i.status_id == 4) {
                                i.status_id = 3
                            }
                        }

                        responseData.push({
                            "project_id": data.project_id,
                            "project_name": data.project_name,
                            "data": res
                        });
                    }
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })

            return [error, responseData];
        }

    }

    this.getLeadApprovalProjectEntries = async function (request) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('get_lead_unassined_projects', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, paramsArr)
                .then(async (data) => {
                    console.log(data,"data")
                    if (data.length > 0) {
                        for (let i of data) {
                            if (!(i.hasOwnProperty("project_lead_employee_id"))) {
                                i.project_lead_employee_id = request.employee_id
                            }
                            let [err, response] = await this.getLeadApprovalProjectEntriesData(request, i)

                            if (response.length > 0) {
                                responseData.push(response);
                            }
                        }
                    }

                    let [err1, selfWorkedData] = await this.getLeadWiseSelfWorkedEntries(request);
                    if (selfWorkedData.length > 0) {
                        responseData.push(selfWorkedData)
                    }
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })

            return [error, responseData.flat()];
        }

    }


    this.getLeadWiseSelfWorkedEntries = async function (request) {
        let responseData = []
    
        const paramsArr = new Array(
            request.employee_id,
            request.first_week_day,
            request.last_week_day,
            request.role_id
        );

        const queryString = util.getQueryString('get_self_approval_project_entries', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    for (let i of data) {
                        if (i.status_id == 5) {
                            i.status_id = 2
                        } else if (i.status_id == 4) {
                            i.status_id = 3
                        }
                        responseData.push({
                            "project_id": i.project_id,
                            "project_name": i.project_name,
                            "data": [i]
                        });
                    }
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    };


    this.getProjectsAndLeads = async function () {
        let responseData = [],
            error = true,
            request = {},
            submittedData = [],
            unSubmittedData = [];
        const paramsArr = new Array(
        );

        let weeks = await util.getPreviousWeek()

        let weekName = await util.getWeekName({ task_created_datetime: weeks.start })

        const queryString = util.getQueryString('get_projects_and_leads', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then(async (data) => {
                    for (let i of data) {
                        let [err, res] = await getProjectAndStatusWiseData({
                            "project_id": i.project_id,
                            "first_week_day": weeks.start,
                            "last_week_day": weeks.end,
                            "email": i.email
                        }, 5)
                        if (res.length > 0) {
                            unSubmittedData.push({
                                "project_name": i.project_name,
                                "project_lead_mail": i.email,
                                data: res
                            })
                        }

                        let [err1, res1] = await getProjectAndStatusWiseData({
                            "project_id": i.project_id,
                            "first_week_day": weeks.start,
                            "last_week_day": weeks.end,
                            "email": i.email
                        }, 1)
                        if (res1.length > 0) {
                            submittedData.push({
                                "project_name": i.project_name,
                                "project_lead_mail": i.email,
                                data: res1
                            })
                        }
                    }

                    responseData.push({
                        "submittedData": submittedData,
                        "unSubmittedData": unSubmittedData
                    })
                    let transformedResponse = {};

                    responseData.forEach(item => {
                        item.submittedData.forEach(submittedData => {
                            if (!transformedResponse.hasOwnProperty(submittedData.project_lead_mail)) {
                                transformedResponse[submittedData.project_lead_mail] = {
                                    "project_lead_mail": submittedData.project_lead_mail,
                                    "submittedData": [],
                                    "unSubmittedData": []
                                };
                            }

                            transformedResponse[submittedData.project_lead_mail].submittedData.push({
                                "project_name": submittedData.project_name,
                                "data": submittedData.data
                            });
                        });

                        item.unSubmittedData.forEach(unSubmittedData => {
                            if (!transformedResponse.hasOwnProperty(unSubmittedData.project_lead_mail)) {
                                transformedResponse[unSubmittedData.project_lead_mail] = {
                                    "project_lead_mail": unSubmittedData.project_lead_mail,
                                    "submittedData": [],
                                    "unSubmittedData": []
                                };
                            }

                            transformedResponse[unSubmittedData.project_lead_mail].unSubmittedData.push({
                                "project_name": unSubmittedData.project_name,
                                "data": unSubmittedData.data
                            });
                        });
                    });

                    let transformedArray = Object.values(transformedResponse);
                    responseData = transformedArray;
                    error = false
                })
                .catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData, weekName]
        }
    }

    async function getProjectAndStatusWiseData(request, status) {
        let responseData = []
        let error = true

        const paramsArr = new Array(
            request.project_id,
            request.first_week_day,
            request.last_week_day,
            request.email,
            status
        );

        const queryString = util.getQueryString('get_project_and_status_wise_data', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then(async (data) => {
                    responseData = data
                    error = false
                })
                .catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData]
        }
    }

    async function getSelfLeadWorkedProjects(request, status) {
        let responseData = []
        let error = true

        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            status
        );

        const queryString = util.getQueryString('get_self_lead_worked_projects', paramsArr);
        console.log(queryString)
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then(async (data) => {
                    responseData = data
                    error = false
                })
                .catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData]
        }
    }

    async function getNoLeadProjects(request, status) {
        let responseData = []
        let error = true

        const paramsArr = new Array(
            request.first_week_day,
            request.last_week_day,
            status
        );

        const queryString = util.getQueryString('get_no_lead_projects', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then(async (data) => {
                    responseData = data
                    error = false
                })
                .catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData]
        }
    }

    this.getLeadProjectsAndSelfApprovalDataForEmailSending = async function () {
        let responseData = [],
            error = false
        const paramsArr = new Array(
        );

        let weeks = await util.getPreviousWeek()

        let weekName = await util.getWeekName({ task_created_datetime: weeks.start })

        let [err, res] = await getNoLeadProjects({
            "first_week_day": weeks.start,
            "last_week_day": weeks.end,
        }, 5)

        let [err1, res1] = await getNoLeadProjects({
            "first_week_day": weeks.start,
            "last_week_day": weeks.end,
        }, 1)

        let [err2, res2] = await getSelfLeadWorkedProjects({
            "first_week_day": weeks.start,
            "last_week_day": weeks.end,
        }, 5)

        let [err3, res3] = await getSelfLeadWorkedProjects({
            "first_week_day": weeks.start,
            "last_week_day": weeks.end,
        }, 1)


        let projectLeadData = {};

        // Helper function to find or create a project object for a specific project lead
        function getProjectObject(email, projectName) {
            if (!projectLeadData[email]) {
                projectLeadData[email] = {};
            }

            if (!projectLeadData[email][projectName]) {
                projectLeadData[email][projectName] = {
                    "project_name": projectName,
                    "data": []
                };
            }

            return projectLeadData[email][projectName];
        }

        // Process res array
        res.forEach(item => {
            let projectObj = getProjectObject(item.lead_assigned_email, item.project_name);

            projectObj.data.push({
                "name": item.full_name,
                "status_id": item.status_id
            });
        });

        // Process res1 array
        res1.forEach(item => {
            let projectObj = getProjectObject(item.lead_assigned_email, item.project_name);

            projectObj.data.push({
                "name": item.full_name,
                "status_id": item.status_id
            });
        });

        // Process res2 array
        res2.forEach(item => {
            let projectObj = getProjectObject(item.lead_assigned_email, item.project_name);

            projectObj.data.push({
                "name": item.full_name,
                "status_id": item.status_id
            });
        });

        // Process res3 array
        res3.forEach(item => {
            let projectObj = getProjectObject(item.lead_assigned_email, item.project_name);

            projectObj.data.push({
                "name": item.full_name,
                "status_id": item.status_id
            });
        });

        // Convert projectLeadData object to the desired data structure
        let data = [];
        for (let email in projectLeadData) {
            let projects = projectLeadData[email];
            let projectArray = Object.keys(projects).map(projectName => projects[projectName]);

            data.push({
                "project_lead_mail": email,
                "submittedData": projectArray.filter(project => project.data.some(entry => entry.status_id === 1)),
                "unSubmittedData": projectArray.filter(project => project.data.every(entry => entry.status_id !== 1))
            });
        }
        console.log(data);

        responseData = data


        return [error, responseData, weekName]

    }

}

module.exports = LeadService;
