

function projectbasedapproval(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const employeeService = new EmployeeService(objectCollection)

    this.getProjectLead = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_id.toString()
        );
        const queryString = util.getQueryString('project_remove_client_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    
                  

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }
   
    this.getEmpDataBasedOnProjects = async function (request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_id.toString(),
            equest.client_id.toString()
        );
        const queryString = util.getQueryString('project_remove_client_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    
                  

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

}


module.exports = projectbasedapproval;
