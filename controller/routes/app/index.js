const fs = require("fs")
const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const multer = require("multer")
const cloudinary = require("cloudinary").v2
// const client = require("./db");
const pool = require("./db");
const mg = require("./mailgun/mailgun")
const uniqid = require('uniqid');
const {
    authenticateToken,
    checkCredentials,
    generateAccessToken,
    loadAnasayfa,
    sendApplication,
    verifyRegisterRoute
} = require("./functions");

const { 
    fetchUserAppsCount,
    getDealerApplications,
    getSDCApplicationsCount
} = require("./database/queries")
const { 
    forDealerGetApplications,
} = require("./database/dealerqueries")

dotenv.config();
process.env.TOKEN_SECRET;


const app = module.exports = express();

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

app.get("/applications/:applicationID", authenticateToken, async(req, res) => {
    try {
        // THIS ROUTE RETURNS ANY APPLICATION, ANY DEALER CAN ACCESS IT
        // ADD SOME VERIFICATION HERE!!!!!!!!!!!!!!!!!!!!!!
        //
        //
        //
        console.log("route hit")
        const { applicationID } = req.params
        let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id = $1",
        [applicationID])
        console.log(query.rows)
        res.status(200).json(query.rows)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})