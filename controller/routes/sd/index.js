const express = require("express");
const pool = require("../../database");
const { customStatusError, status500Error, verifyReqObjExpectedObjKeys } = require("../../helpers/functions");
const { authenticateToken, verifyInputNotEmpty } = require("../../helpers/middleware");
const { verifyUpdateApplication } = require("./middleware");
const { 
    updateApplicationPhase1, 
    updateApplicationPhase2, 
    getSdUsers,
    verifyUserID,
    verifySdResponsibleForUser
} = require("./functions");
const { getGoal } = require("../sharedfunctions")

const app = module.exports = express();

// This route is responsible for updating an application's status, alongside a short explanation regarding the status change.
// It accepts two fields from req.body. { salesRepDetails, statusChange }. These two fields are mandatory. It fires two functions
// based on a condition:
// IF the application has the current status of 'sent', call updateApplicationPhase1 function.
// IF the application has the current status of 'sent' and statusChange of 'rejected', call updateApplicationPhase2 function.
// IF the application DOES NOT have current status of 'sent', call updateApplicationPhase2 function.
app.put(
    "/application/:applicationID",
    authenticateToken,
    verifyInputNotEmpty, 
    verifyUpdateApplication,
    async (req, res) => {
    // verify expected request body object keys
    verifyReqObjExpectedObjKeys(["salesRepDetails", "statusChange"], req, res)

    // deconstructure the appID and status values from verifyUpdateApplication middleware
    const { appID, currentStatus } = res.locals.updateAppQuery
    // get the sales rep (sales assistant) details and new status from req.body
    const { salesRepDetails, statusChange } = req.body
    // error strings
    const serverErrorStr = "server error occurred while attempting to update application"
    const unexpectedStatusChangePhase1 = "Expected 'processing' or 'rejected' instead got '" + statusChange + "' AT " + __dirname 
    const unexpectedStatusChangePhase2 = "Expected 'approved' or 'rejected' instead got '" + statusChange + "' AT " + __dirname 

    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        let result // result returns an object that contains done bool, and IF err, error string keys.
        // if the application has not been processed yet...
        if (currentStatus === "sent") {
            // IF approved, return error to prevent unexpected status change input (user can not update an application to 'approved' that has current status of 'sent')
            if (statusChange === "approved")
                return customStatusError(unexpectedStatusChangePhase1, res, 401, "Unexpected input")
            // IF rejected, jump to phase2 since no further updates will be allowed after 'rejected' status
            else if (statusChange === "rejected")
                result = await updateApplicationPhase2(client, statusChange, salesRepDetails, appID)
            // ELSE
            else
                result = await updateApplicationPhase1(client, statusChange, salesRepDetails, appID)
        // else the application has been processed, and awaits approval or rejection...
        } else {
            // prevent unexpected status change input
            if (statusChange === "processing")
                return customStatusError(unexpectedStatusChangePhase2, res, 401, "Unexpected input")
            result = await updateApplicationPhase2(client, statusChange, salesRepDetails, appID)
        }
        // if everything runs successfully...
        if (result.done) {
            await client.query('COMMIT')
            return res.status(200).json("Application was updated successfully")
        // ELSE
        } else {
            await client.query('ROLLBACK')
            return status500Error(result.error, res, serverErrorStr)
        }
        // an extra catch block in main function that does more or less the same as the above error functions
        } catch (err) {
            await client.query('ROLLBACK')
            return status500Error(err, res, serverErrorStr)
        } finally {
            client.release()
        }

})

// This route is pretty straight forward. It returns a list of dealer users that fall under the responsibility of the SD who submitted
// this request.
app.get("/users", authenticateToken, async (req, res) => {
    const userInfo = res.locals
    const { userRole, name } = userInfo
    if (userRole === "sales_assistant")
        await getSdUsers(name, res)
    else
        return customStatusError("user '" + name + "' attempted to access /users but did not have 'sales_assistant' role", res, 403, "You do not have permission to access this route")
})


// This route returns a specific user's goal, it first verifies if the SD request submitter's requested user's goal BELONGS to his area
// along with some other checks, if all checks pass, it returns that user's goal 
app.get("/goal/sd", async(req, res) => {
    // const sdID = res.locals.userInfo.userID
    const { userID, services, month, year } = req.query
    const sdID = "1fa591a4cksg064ub"
    if (userID) {
        await verifyUserID(userID, res)
        if (!await verifySdResponsibleForUser(userID, sdID)) {
            const errorStr = "user ID '" + userInfo.userID + "' attempted to access /goal/sd and fetch specific user ID '"+ req.query.userID +"'s goal but did not have permission because the user does not fall under their responsibility at "+ __dirname
            return customStatusError(errorStr, res, 403, "you are not responsible for this user")
        }
        const dealerGoals = await getGoal(services, userID, month, year)
        return res.json(dealerGoals)
    } else {
        res.json('req query is empty')
    }
})