const express = require("express")
const pool = require("../../database");
const { status500Error, customStatusError } = require("../../helpers/functions");
const { getDealerApplications } = require("./functions")
const { authenticateToken } = require("../../helpers/middleware")

const app = module.exports = express();

// This route returns all of the services, takes profitable as route query argument. 
app.get("/services", async (req, res) => {
    try {
        const { profitable } = req.query
        let serviceQuery
        if (profitable)
            serviceQuery = await pool.query("SELECT * FROM services WHERE active = true AND profitable = true")
        else
            serviceQuery = await pool.query("SELECT * FROM services WHERE active = true")
        return res.status(200).json(serviceQuery.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json("an error occurred while fetching services data")
    }
})

// This route returns a specific application according to it's ID.
// If the request submitter is the same dealer who submitted the application, return 
// respective application, if not, return 403.
// If the request submitter is SD or SDC, return application

// ROUTE CHANGE FROM /applications/:applicationID TO /application/:applicationID
app.get("/application/:applicationID", authenticateToken, async(req, res) => {
    try {
        const queryStatement = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id = $1"
        const submitterConditionalStatement = " AND submitter = $2"
        const customErr = "at application/:applicationID, database query returned an empty array"
        const reqSubmitterRole = res.locals.userInfo.role
        const { applicationID } = req.params
        let query
        // if the request submitter is SDC or SD, return any application regardless of who is the application submitter
        if (reqSubmitterRole !== "dealer")
            query = await pool.query(queryStatement, [applicationID])
        // else, return the application ONLY if the request submitter is the same as the application submitter
        else {
            query = await pool.query(queryStatement + submitterConditionalStatement, [applicationID])
            // if the submitter who requested the application through application ID returns
            // empty (probably because reqSubmitterRole is not the same as application submitter) return error
            if (query.rows.length === 0)
                return customStatusError(customErr, res, 403, "You are not authorized to fetch this application")
        }
        //if all good return query
        return res.status(200).json(query.rows)
    } catch (err) {
        return status500Error(err, res, "server error could not fetch specific application")
    }
})

app.get("/applications/:query", async (req, res) => {
    // const { userID } = res.locals.userInfo
    const userID = "1fa5915jwksg069fe" //FOR TESTING PURPOSES, DELETE LATER, also add authenticateToken middleware
    const { query } = req.params
    const { status, interval, service, month, year } = req.query
    try {
        let selectQuery
        if (month && year)
            selectQuery = await getDealerApplications(query, [month, year], userID, status, service)
        else
            selectQuery = await getDealerApplications(query, interval, userID, status, service)
        return res.status(200).json(selectQuery)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Unable to fetch dealer applications")
    }
})

app.get("/bayi/applications", authenticateToken, async(req, res) => {
    try {
        const username = res.locals.userInfo.username
        const { status } = req.query
        const response = await forDealerGetApplications(username, status)
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})