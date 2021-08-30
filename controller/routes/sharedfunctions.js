const pool = require("../database")
const {
    queryConstructorDate, 
    switchServiceNameToTurkish,
    getDealerName
} = require("../helpers/functions")

const getGoal = async (services = "ALL", userID = "ALL", month = "ALL", year = "ALL") => {
    // Statements...
    const goalSelectStatement = "SELECT * FROM goals"
    const serviceConditionStatement = "service ="
    const userConditionStatement = "for_user ="
    const extractMonthStatement = "EXTRACT(MONTH FROM for_date) ="
    const extractYearStatement = "EXTRACT(YEAR FROM for_date) ="

    // If username == "ALL", dont change it since it will be omitted below anyways, ELSE get username accord to it's ID
    let username
    if (userID === "ALL")
        username = "ALL"
    else username = await getDealerName(userID)

    // If service == "ALL", dont change it since it will be omitted below anyways, ELSE, to prevent unicode in URL query
    // params, switch the service name to turkish letters to match it in the database
    let service
    if (services === "ALL")
        service = services
    else service = switchServiceNameToTurkish(services)

    // Original arrays of query parameters and statements
    const queryParams = [service, username, month, year]
    const queryConditionStatements = [serviceConditionStatement, userConditionStatement, extractMonthStatement, extractYearStatement]

    // Verified arrays of query parameters and statements
    let verifiedQueryParams = []
    let verifiedQueryConditionStatements = []
    for (let i = 0; i < queryParams.length; i++) {
        if (queryParams[i] !== "ALL") {
            verifiedQueryParams.push(queryParams[i])
            verifiedQueryConditionStatements.push(queryConditionStatements[i])
        }
    }

    // Final statement that will get submitted
    const finalQueryStatement = queryConstructorDate(goalSelectStatement, verifiedQueryConditionStatements)
    try {
        const finalQuery = await pool.query(finalQueryStatement, verifiedQueryParams)
        return finalQuery.rows
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getGoal
}