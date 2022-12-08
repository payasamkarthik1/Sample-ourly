

const TimeTrackingService = require('../services/timeTrackingService')
const EmployeeService = require('../services/employeeService')
const LeadService = require('./leadService')


function AnalyzeServices(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const timeTrackingService = new TimeTrackingService(objectCollection)
    const employeeService = new EmployeeService(objectCollection)
    const leadService = new LeadService(objectCollection)


    //----------------------dashboards----------------


    this.getDasboardOverview = async function (request) {
        let responseData = []

        let data1 = []
        //get employess under head
        if (request.role_id == 2) {
            const [err8, data8] = await employeeService.getAllEmployees(request)
            data1 = data8
        } else if (request.role_id == 3) {
            const [err9, data9] = await employeeService.getEmployeeById(request)
            data1 = data9
        } else {
            const [err10, data10] = await leadService.getEmployessAssignUnderHeads(request, 2)
            data1 = data10
        }

        //get data between date
        const [err2, data2] = await this.getDataByDates(request)

        //get dashboard data overview
        if (data1.length != 0 && data2.length != 0) {
            //filter data with emps
            const data3 = await this.filterDataByEmps(request, data1, data2)
            if (data3.length != 0) {
                // //get dashboard data
                const [err, data] = await this.dashboardDataCalculationOverview(request, data3)
                responseData = data
            }


        }
        return [false, responseData]
    }

    this.dashboardDataCalculationOverview = async function (request, data3) {
        console.log('-------------------------entered dashboardDataCalculationOverview--------');
        let responseData = []
        // total time
        idGenerate = await util.getRandomNumericId()
        const id = idGenerate
        totalTime = await util.sumOfTime(data3)

        //insert data into table for calce
        for (i = 0; i < data3.length; i++) {
            flag = 1
            const [err1, data4] = await this.dataInsertForCalculation(request, data3[i], id)
        }

        //get data daywise in dashboard
        flag = 2
        const [err4, data4] = await this.dataGetBasedOnRequirment(request, id, flag)
        dayWiseData = data4
        var newArray = dayWiseData.reduce(function (acc, curr) {
            //finding Index in the array where the NamaCategory matched
            var findIfNameExist = acc.findIndex(function (item) {
                return item.project_name === curr.project_name;
            })
            if (findIfNameExist === -1) {

                let obj = {
                    'project_name': curr.project_name,
                    "value": [curr]
                }
                acc.push(obj)
            } else {
                acc[findIfNameExist].value.push(curr)
            }

            return acc;

        }, []);

        //get total projects total hours 
        flag = 3
        const [err5, data5] = await this.dataGetBasedOnRequirment(request, id, flag)
        overallProjects = data5

        //over all total_time daywise
        flag = 6
        const [err6, data6] = await this.dataGetBasedOnRequirment(request, id, flag)
        overallTotalTime = data6

        //get top project
        flag = 4
        const [err7, data7] = await this.dataGetBasedOnRequirment(request, id, flag)
        topProject = data7[0]

        // delete data
        await this.dataGetBasedOnRequirment(request, id, 5)

        responseData.push({ total_time: totalTime, top_project: topProject })
        responseData.push(newArray)
        responseData.push(overallTotalTime)
        responseData.push(overallProjects)

        return [false, responseData];


    };

    this.getAllTasksFilterByDescrip = async function (request) {
        console.log('---------------entered getAllTasksFilterByDescrip---------------------- ');
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.start_date,
            request.end_date,
            request.employee_id
        );

        const queryString = util.getQueryString('dashboard_get_top_tasks_filter_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=======dashboard_get_top_tasks_filter_select======');
                    console.log(data);
                    console.log('====================================');
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getAllTasksInWeekByEmpId = async function (request) {
        let responseData = []
        obj = {}

        obj.firstWeekDay = (request.first_week_day)
        obj.lastWeekDay = (request.last_week_day)
        const [err, data] = await timeTrackingService.getAllTasksInThatWeeks(request, obj)

        const [err1, data1] = await timeTrackingService.getSubmittedApproveEntries(request, 1)
        const [err2, data2] = await timeTrackingService.getSubmittedApproveEntries(request, 2)

        if (data1.length != 0 || data2.length != 0) {
            if (data[0].isApp.status === "PENDING") {
                data[0].isApp.submited_by = data1[0].submitted_by.concat("(", data1[0].submited_for_approval_datetime, ")")
            } else if (data[0].isApp.status === "APPROVED") {
                data[0].isApp.submited_by = data1[0].submitted_by.concat("(", data1[0].submited_for_approval_datetime, ")")
                data[0].isApp.approved_by = data2[0].approved_by.concat("(", data2[0].approved_on_datetime, ")")
            }

        }
        responseData.push(data)
        return [err, responseData];

    };




    //-------------------------reports---------------------


    this.getReportSummary = async function (request) {
        let responseData = []

        let data1 = []
        let empsGathered = []
        //get employess under head
        if (request.role_id == 2) {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    for (let i = 0; employees.length; i++) {
                        request.employee_id = employees[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    for (let i = 0; groups.length; i++) {
                        request.employee_id = groups[i]
                        const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 2)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess

                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const [err8, data8] = await employeeService.getAllEmployees(request)
                data1 = data8
            }

        } else if (request.role_id == 3) {
            const [err9, data9] = await employeeService.getEmployeeById(request)
            data1 = data9
        } else {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    for (let i = 0; employees.length; i++) {
                        request.employee_id = employees[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    for (let i = 0; groups.length; i++) {
                        request.employee_id = groups[i]
                        const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 2)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess

                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 2)
                data1 = data9
            }
        }

        //get data between date
        const [err2, data2] = await this.getDataByDates(request)


        //get dashboard data overview
        if (data1.length != 0 && data2.length != 0) {
            //filter data with emps
            const data3 = await this.filterDataByEmps(request, data1, data2)
            console.log('==========filterDataByEmps=============')
            console.log(data3)
            console.log('====================================')
            const [err, data] = await this.getReportSummaryOverviewCalculation(request, data3)
            responseData = data
        }
        return [false, responseData]
    }

    this.getReportSummaryGroupByUser = async function (request) {
        let responseData = []

        let data1 = []
        let empsGathered = []
        //get employess under head
        if (request.role_id == 2) {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    for (let i = 0; employees.length; i++) {
                        request.employee_id = employees[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    for (let i = 0; groups.length; i++) {
                        request.employee_id = groups[i]
                        const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 1)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess

                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const [err8, data8] = await employeeService.getAllEmployees(request)
                data1 = data8
            }

        } else if (request.role_id == 3) {
            const [err9, data9] = await employeeService.getEmployeeById(request)
            data1 = data9
        } else {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    for (let i = 0; employees.length; i++) {
                        request.employee_id = employees[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    for (let i = 0; groups.length; i++) {
                        request.employee_id = groups[i]
                        const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 1)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess

                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const [err9, data9] = await leadService.getEmployessAssignUnderHeads(request, 1)
                data1 = data9
            }
        }

        //get data between date
        const [err2, data2] = await this.getDataByDates(request)


        //get dashboard data overview
        if (data1.length != 0 && data2.length != 0) {
            //filter data with emps
            const data3 = await this.filterDataByEmps(request, data1, data2)
            console.log('==========filterDataByEmps=============')
            console.log(data3)
            console.log('====================================')
            const [err, data] = await this.getReportSummaryGroupByUserOverviewCalculation(request, data3)
            responseData = data
        }
        return [false, responseData]
    }

    this.getFilterReportSummary = async function (request, data) {
        console.log('=====entered into getFilterReportSummary==============')
        console.log(data)
        console.log('====================================')
        let responseData = []
        error = true
        filterClients1 = []
        filterProjects1 = []
        filterTags1 = []
        filterStatus1 = []
        client_id = request.client_ids
        project_id = request.project_ids
        tag_id = request.tag_ids
        status_id = request.status_ids

        if (client_id.length == 0 && project_id.length == 0 && tag_id.length == 0 && status_id.length == 0) {
            console.log('===========ENTERED ALL FILTERES NOT SELECTED DAFAULT==============')
            console.log('==========DATA==============')
            console.log(data)
            console.log('====================================')
        } else if (client_id.length != 0 && project_id.length != 0 && tag_id.length != 0 && status_id.length != 0) {
            console.log('=========ENTERED ALL FILTERES SELECTED=============')
            if (client_id != []) {
                for (let i = 0; i < client_id.length; i++) {
                    data.filter(function (data) {
                        if (data.client_id == client_id[i]) {
                            filterClients1.push(data)
                        }
                    })
                }

            }
            else if (project_id != []) {
                for (let i = 0; i < project_id.length; i++) {
                    filterClient1.filter(function (data) {
                        if (data.project_id == project_id[i]) {
                            filterProjects1.push(data)
                        }
                    })
                }
            }
            else if (tag_id != []) {
                for (let i = 0; i < tag_id.length; i++) {
                    filterProjects1.filter(function (data) {
                        if (data.tag_id == tag_id[i]) {
                            filterTags1.push(data)
                        }
                    })
                }
            }
            else if (status_id != []) {
                for (let i = 0; i < status_id.length; i++) {
                    filterTags1.filter(function (data) {
                        if (data.status_id == status_id[i]) {
                            filterStatus1.push(data)

                        }
                    })
                }
                console.log('=====jfnkf=============')
                console.log(filterStatus)
                console.log('====================================')
            }
            data = filterStatus1;
            console.log('=========FILTERED DATA==============')
            console.log(data)
            console.log('====================================')

        } else {
            console.log('===========ENTERED ANY ONE FILTER SELECTED=============')
            if (client_id.length == 0) {
                filterClients1 = data

            } if (client_id.length != 0) {
                for (let i = 0; i < client_id.length; i++) {
                    data.filter(function (data) {
                        if (data.client_id == client_id[i]) {
                            filterClients1.push(data)
                        }
                    })
                }
            } if (project_id.length == 0) {
                filterProjects1 = filterClients1
            } if (project_id.length != 0) {

                for (let i = 0; i < project_id.length; i++) {
                    filterClients1.filter(function (data) {
                        if (data.project_id == project_id[i]) {
                            filterProjects1.push(data)
                        }
                    })
                }

            } if (tag_id.length == 0) {
                filterTags1 = filterProjects1
            } if (tag_id.length != 0) {
                for (let i = 0; i < tag_id.length; i++) {
                    filterProjects1.filter(function (data) {
                        if (data.tag_id == tag_id[i]) {
                            filterTags1.push(data)
                        }
                    })
                }
            } if (status_id.length == 0) {
                filterStatus1 = filterTags1
            } if (status_id.length != 0) {
                for (let i = 0; i < status_id.length; i++) {
                    filterTags1.filter(function (data) {
                        if (data.status_id == status_id[i]) {
                            filterStatus1.push(data)
                        }
                    })
                }
            }

            data = filterStatus1
            console.log('=====FILTER DATA==============')
            console.log(data)
            console.log('====================================')

        }

        responseData = data
        error = false
        return [error, responseData]
    }

    this.getReportSummaryOverviewCalculation = async function (request, data) {
        let responseData = []

        const [err, filterData] = await this.getFilterReportSummary(request, data)
        if (filterData.length != 0) {
            // total time
            idGenerate = await util.getRandomNumericId()
            const id = idGenerate
            totalTime = await util.sumOfTime(filterData)

            //insert data into table for calce
            for (i = 0; i < filterData.length; i++) {
                flag = 1
                const [err1, data1] = await this.dataInsertForCalculation(request, filterData[i], id)
            }
            //get total projects total hours 
            flag = 3
            const [err3, data3] = await this.dataGetBasedOnRequirment(request, id, flag)
            overallProjects = data3

            //adding uniques keys 
            overallProjects1 = await util.addUniqueKeyIndexesToArrayOfObject(overallProjects)
            //loop for adding descriptions 
            for (let i = 0; i < overallProjects1.length; i++) {
                let value = []
                filterData.filter(function (dat) {
                    if (dat.project_id == overallProjects1[i].project_id) {
                        obj = {}
                        obj.task_description = dat.task_description
                        obj.task_total_time = dat.task_total_time
                        obj.employee_name = dat.employee_full_name
                        value.push(obj)
                    }

                })
                overallProjects1[i].description = value
            }

            //over all total_time daywise
            flag = 6
            const [err5, data5] = await this.dataGetBasedOnRequirment(request, id, flag)
            overallTotalTime = data5

            // delete data
            flag = 5
            await this.dataGetBasedOnRequirment(request, id, flag)

            responseData.push({ total_time: totalTime })
            responseData.push(overallTotalTime)
            responseData.push(overallProjects1)

        }
        return [false, responseData]
    }

    this.getReportSummaryGroupByUserOverviewCalculation = async function (request, data) {
        let responseData = []
        const [err, filterData] = await this.getFilterReportSummary(request, data)
        if (filterData.length != 0) {
            // total time
            idGenerate = await util.getRandomNumericId()
            id = idGenerate
            totalTime = await util.sumOfTime(filterData)
            //insert data into table for calce
            for (i = 0; i < filterData.length; i++) {
                flag = 1
                const [err1, data1] = await this.dataInsertForCalculation(request, filterData[i], id)
            }
            //get overall total user hours 
            flag = 8
            const [err3, data3] = await this.dataGetBasedOnRequirment(request, id, flag)
            overallUsers = data3


            //adding uniques keys 
            overallUsers1 = await util.addUniqueKeyIndexesToArrayOfObject(overallUsers)

            //loop for adding descriptions 
            for (let i = 0; i < overallUsers1.length; i++) {
                let value = []
                data.filter(function (dat) {
                    if (dat.employee_id == overallUsers1[i].employee_id) {
                        obj = {}
                        obj.task_description = dat.task_description
                        obj.task_total_time = dat.task_total_time
                        obj.project_name = dat.project_name
                        obj.project_code = dat.project_code
                        obj.project_color_code = dat.project_color_code
                        value.push(obj)
                    }

                })
                overallUsers1[i].description = value
            }

            //over all total_time daywise
            flag = 6
            const [err5, data5] = await this.dataGetBasedOnRequirment(request, id, flag)
            overallTotalTime = data5
            delete data
            flag = 5
            await this.dataGetBasedOnRequirment(request, id, flag)

            responseData.push({ total_time: totalTime })
            responseData.push(overallTotalTime)
            responseData.push(overallUsers1)
        }

        return [false, responseData]
    }




    this.dataInsertForCalculation = async function (request, data, id) {
        console.log('====================================')
        console.log(data)
        console.log('====================================')
        let responseData = [],
            error = true;
        paramsArr = new Array(
            id,
            data.employee_id,
            data.project_id,
            data.task_total_time,
            data.task_created_datetime,
            data.task_start_time,
            data.task_end_time,
        );

        const queryString = util.getQueryString('data_insert_for_calucation', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    error = false
                    responseData = data

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.dataGetBasedOnRequirment = async function (request, id, flag) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            id,
            flag
        );

        const queryString = util.getQueryString('data_get_requirment', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    error = false
                    responseData = data

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.getDataByDates = async function (request) {
        console.log('------------entered getDataByDates------------------------');
        let responseData = [],
            error = true;
        // if flag =3 get get data by dates
        flag = 1
        const paramsArr = new Array(
            request.start_date,
            request.end_date,
            flag
        );

        const queryString = util.getQueryString('data_get_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                    error = false
                    responseData = data
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.filterDataByEmps = async function (request, data1, data2) {
        let filterData = []
        console.log('------------entered filterDataByEmps----------------------');
        for (let i = 0; i < data1.length; i++) {
            data2.filter(function (dat) {
                if (dat.employee_id == data1[i].employee_id) {
                    filterData.push(dat)
                }
            })
        }

        return filterData
    }


};









module.exports = AnalyzeServices;
