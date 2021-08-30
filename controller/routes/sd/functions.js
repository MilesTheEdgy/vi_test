const pool = require("../../database")
const { 
    status500Error, 
    customStatusError
} = require("../../helpers/functions")

const updateApplicationPhase1 = async (client, statusChange, salesRepDetails, appID) => {
    try {
        await client.query("UPDATE sales_applications_details SET sales_rep_details = $1, status_change_date = CURRENT_TIMESTAMP WHERE id = $2",
            [salesRepDetails, appID])
        await client.query("UPDATE sales_applications SET status = $1 WHERE id = $2", [statusChange, appID])
        return {done: true}
    } catch (err) {
        return {done: false, error: err}
    }
}

const updateApplicationPhase2 = async (client, statusChange, salesRepDetails, appID) => {
    try {
        await client.query("UPDATE sales_applications_details SET final_sales_rep_details = $1 WHERE id = $2",
        [salesRepDetails, appID])
        await client.query("UPDATE sales_applications SET status = $1, last_change_date = CURRENT_TIMESTAMP WHERE id = $2", [statusChange, appID])
        return {done: true}
    } catch (err) {
        return {done: false, error: err}
    }
}

const getSdUsers = async (name, res) => {
    try {
        getUsersQueryStatement = "SELECT name, register_date, active, role FROM login WHERE assigned_to = (SELECT responsible_area FROM login WHERE name = $1)"
        const getUsersAccordToResponibleArea = await pool.query(getUsersQueryStatement, [name])
        return res.status(200).json(getUsersAccordToResponibleArea.rows)
    } catch (err) {
        return status500Error(err, res, "server error could not fetch dealer users")
    }
}

const verifyUserID = async (userID, res) => {
    try {
        verifyStatement = "SELECT user_id FROM login WHERE user_id = $1"
        const query = await pool.query(verifyStatement, [userID])
        if (query.rows.length === 0) {
            const errorStr = "user with ID '" + userID + "' does not exist in database"
            return customStatusError(errorStr, res, 401, "User does not exist")
        }
        return true
        
    } catch (err) {
        status500Error(err, res, "An error occurred while verifying user")
    }
}

const verifySdResponsibleForUser = async (userID, sdID) => {
    verifyQueryStatement = "SELECT user_id FROM login WHERE assigned_to = (SELECT responsible_area FROM login WHERE user_id = $1)"
    const query = await pool.query(verifyQueryStatement, [sdID])
    if (query.rows[0].user_id !== userID)
        return false
    return true
}

module.exports = {
    updateApplicationPhase1,
    updateApplicationPhase2,
    getSdUsers,
    verifyUserID,
    verifySdResponsibleForUser,
}