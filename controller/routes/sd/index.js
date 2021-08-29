const express = require("express");
const pool = require("../../database");
const { customStatusError, status500Error, verifyReqBodyExpectedObjKeys } = require("../../helpers/functions");
const { authenticateToken, verifyInputNotEmpty } = require("../../helpers/middleware")

const app = module.exports = express();

app.put("/application/:applicationID", verifyInputNotEmpty, async (req, res) => {
    verifyReqBodyExpectedObjKeys(["salesRepDetails", "statusChange"], res)
    const client = await pool.connect()
    // if an ID that doesn't exist in database gets sent, nothing get's updated but no error get's triggered.

    // const { userRole } = res.locals.userInfo
    const userRole = "sales_assistant_chef"
    if (userRole !== "sales_assistant" && userRole !== "sales_assistant_chef")
        return customStatusError("submitted request does not have SD or SDC role", res, 401, "You are not authorized to update applications")
    const { applicationID } = req.params
    const { salesRepDetails, statusChange } = req.body
    const d = new Date()
    try {
        const query = await client.query("SELECT last_change_date FROM sales_applications WHERE id = $1", [applicationID])
        // *** because I updated the status records of the database manually, I temporarily commented the lines of code below, I need to uncomment them again
        // *** In order for me to do that, It would be easier to delete all existing applications and make new ones.
        // if (query.rows[0].last_change_date !== null)
        //     return res.status(401).json("You cannot set application status to approved without first procedures")
        console.log("query", query.rows)
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        await client.query('BEGIN')
        await client.query("UPDATE sales_applications_details SET sales_rep_details = $1, status_change_date = $2 WHERE id = $3",
            [salesRepDetails, currentDate, applicationID])
        await client.query("UPDATE sales_applications SET status = $1 WHERE id = $2", [statusChange, applicationID])
        await client.query('COMMIT')
        res.status(200).json("Application was updated successfully")
        
        } catch (err) {
        await client.query('ROLLBACK')
        return status500Error(err, res, "server error occurred while attempting to update application")
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