const { customStatusError } = require("../../helpers/functions")
const pool = require("../../database")

const verifyUpdateApplication = async (req, res, next) => {
    // const { userRole } = res.locals.userInfo
    const userRole = "sales_assistant_chef"
    if (userRole !== "sales_assistant" && userRole !== "sales_assistant_chef")
        return customStatusError("submitted request does not have SD or SDC role", res, 401, "You are not authorized to update applications")

    const { applicationID } = req.params
    verifyAppIDQuery = await pool.query("SELECT id, status FROM sales_applications WHERE id = $1", [applicationID])
    if (typeof verifyAppIDQuery.rows[0]?.id !== "number")
        return customStatusError(
            "requested ID '" + applicationID + "' does not exist in database at "+__dirname, 
            res, 
            401, 
            "This application ID does not exist"
        )
    if (verifyAppIDQuery.rows[0]?.status === "approved" || verifyAppIDQuery.rows[0]?.status === "rejected")
    return customStatusError(
            "requested application with ID '" + applicationID + "' is approved or rejected, can not make further changes at "+__dirname, 
            res, 
            401, 
            "You can not make further changes to this application"
        )
    const expectedStatusChange = ["processing", "rejected", "approved"]
    if (!expectedStatusChange.includes(req.body.statusChange))
        return customStatusError(
            "requested application with ID '" + applicationID + "' has an unexpected req.body.statusChange field input at "+__dirname,
            res,
            401,
            "Unexpected input"
        )
    //if all verifications pass
    const appID = verifyAppIDQuery.rows[0].id
    const currentStatus = verifyAppIDQuery.rows[0].status
    res.locals.updateAppQuery = {
        appID,
        currentStatus
    }
    next()
}

module.exports = {
    verifyUpdateApplication
}