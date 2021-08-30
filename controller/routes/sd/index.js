const express = require("express");
const pool = require("../../database");
const { customStatusError, status500Error, verifyReqBodyExpectedObjKeys } = require("../../helpers/functions");
const { authenticateToken, verifyInputNotEmpty } = require("../../helpers/middleware");
const { verifyUpdateApplication } = require("./middleware");
const { updateApplicationPhase1, updateApplicationPhase2 } = require("./functions");

const app = module.exports = express();

app.put(
    "/application/:applicationID", 
    verifyInputNotEmpty, 
    verifyUpdateApplication,
    async (req, res) => {
    verifyReqBodyExpectedObjKeys(["salesRepDetails", "statusChange"], req, res)

    // deconstructure the appID and status values from verifyUpdateApplication middleware
    const { appID, currentStatus } = res.locals.updateAppQuery
    // get the sales rep (sales assistant) details and new status from req.body
    const { salesRepDetails, statusChange } = req.body
    // error strings
    const serverErrorStr = "server error occurred while attempting to update application"
    const unexpectedStatusChangePhase1 = "Expected 'processing' or 'rejected' instead got '" + statusChange + "' AT " + __dirname 
    const unexpectedStatusChangePhase2 = "Expected 'approved' or 'rejected' instead got '" + statusChange + "' AT " + __dirname 
    // const d = new Date()
    // const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        // define server error string in case of error
        let result // result returns an object that contains done bool, and if err, error string keys.
        // if the application has not been processed yet
        if (currentStatus === "sent") {
            // prevent unexpected status change input
            if (statusChange === "approved")
                return customStatusError(unexpectedStatusChangePhase1, res, 401, "Unexpected input")
            result = await updateApplicationPhase1(client, statusChange, salesRepDetails, appID)
        // else the application has been processed, and awaits approval or rejection
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

// THE CODE ABOVE AND THE CODE BELOW CAN BE A SINGLE ROUTE WITH TWO functions that one of them runs on condition!!!!

app.put("/basvurular/:applicationID/sp", authenticateToken, async (req, res) => {
    const client = await pool.connect()
    const userInfo = res.locals.userInfo
    if (userInfo.role === "sales_assistant" || userInfo.role === "sales_assistant_chef") {
        const { applicationID } = req.params
        const { salesRepDetails, statusChange } = req.body
        const d = new Date()
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        try {
            const query = await client.query("SELECT last_change_date FROM sales_applications WHERE id = $1", [applicationID])
            // if (query.rows[0].last_change_date !== null)
            //     return res.status(401).json("You cannot set application status to approved without first procedures")
            await client.query('BEGIN')
            await client.query("UPDATE sales_applications_details SET final_sales_rep_details = $1 WHERE id = $2",
            [salesRepDetails, applicationID])
            await client.query("UPDATE sales_applications SET status = $1, last_change_date = $2 WHERE id = $3", [statusChange, currentDate, applicationID])
            await client.query('COMMIT')
            res.status(200).json("Application was updated successfully")
        } catch (e) {
            console.log(e)
            await client.query('ROLLBACK')
            return res.status(500).json("An error occurred while attempting to update application")
        } finally {
            client.release()
        }
    } else {
        return res.status(401).json("this user does not have sales assistant premission")
    }
})