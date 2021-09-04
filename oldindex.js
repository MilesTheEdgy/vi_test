//are you okay brah
const fs = require("fs")
const Bree = require("bree")
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const pool = require("./db");
const mg = require("./mailgun/mailgun")
const uniqid = require('uniqid');
const {
    checkCredentials,
    generateAccessToken,
    loadAnasayfa,
    sendApplication,
    verifyRegisterRoute
} = require("./functions");

const { authenticateToken } = require("./controller/helpers/middleware")

const {
    fetchUserAppsCount,
    getDealerApplications,
    getSDCApplicationsCount
} = require("./database/queries")
const { 
    forDealerGetApplications,
} = require("./database/dealerqueries")

const verifyRoute = require("./controller/routes/verify")
const generalRoute = require("./controller/routes/app")
const dealerRoute = require("./controller/routes/dealer")
const sdRoute = require("./controller/routes/sd")
const sdcRoute = require("./controller/routes/sdc")

const bree = new Bree({
    jobs: [
      {
        name: 'printreport',
        cron: "0 2 1 * *"
      }
    ]
  });
bree.start();

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'uploads', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_yoyo_' + Date.now() 
             + path.extname(file.originalname))
    }
  });
const upload = multer({
    storage: imageStorage,
    limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
    // console.log("multer -- req: ", req)
    // console.log("multer -- file: ", file)
    if (!file.originalname.match(/\.(png|jpg)$/)) { 
        return cb(new Error('Please upload an Image'))
        }
    cb(undefined, true)
    }
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

app.use(express.json());
app.use(express.static(path.join(__dirname+'/client/build')));
app.use(express.static(path.join(__dirname+'/pages/enternewpass/build')));
app.use(cors());
app.use(verifyRoute)
app.use(generalRoute)
app.use(dealerRoute)
app.use(sdRoute)
app.use(sdcRoute)

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

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

// This code handles sending the applications the dealer submitted, it takes "dealerName"
// supplied from authenticateToken middleware. "query" has two possible values: count and details.
// if query has value of "count" it returns the applications count according to specific critera
// if it's "details", it returns the columns of the application's details according to specific
// criteria. 
// app.get("/dealer/applications/:query", authenticateToken, async (req, res) => {
//     const { userID } = res.locals.userInfo
//     // const dealerName = "ademiletişim"
//     const { query } = req.params
//     const { status, interval, service, month, year } = req.query
//     try {
//         let selectQuery
//         if (month && year)
//             selectQuery = await getDealerApplications(query, [month, year], userID, status, service)
//         else
//             selectQuery = await getDealerApplications(query, interval, userID, status, service)
//         return res.status(200).json(selectQuery)
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json("Unable to fetch dealer applications")
//     }
// })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// SATIŞ DESTEK///////////////////////////////////////////////////////////////////////////////////////

app.get("/sd/basvurular/goruntule", authenticateToken, async (req, res) => {
    try {
        const userInfo = res.locals.userInfo
        console.log('role: ', userInfo.role)
        if (userInfo.role === "sales_assistant" || userInfo.role === "sales_assistant_chef") {
            let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id")
            res.status(200).json(query.rows)
        } else
            return res.status(401).json("this user does not have sales assistant premission")
    } catch (error) {
        console.error(error);
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// SATIŞ DESTEK ÇEF///////////////////////////////////////////////////////////////////////////////////////

app.get("/sdc/users", authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    try {
        const query = await pool.query("SELECT user_id, username, role, register_date, active FROM login")
        res.status(200).json(query.rows)
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.get("/sdc/user/:userID", authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    const { userID } = req.params
    try {
        const query = await pool.query("SELECT user_id, username, role, active, register_date FROM login WHERE user_id = $1", [userID])
        res.status(200).json(query.rows[0])
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.put("/sdc/user/:userID", authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    const { userID } = req.params
    try {
        await pool.query("UPDATE login SET active = NOT active WHERE user_id = $1", [userID])
        res.status(200).json("User status update was a success")
    } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to toggle user active status ")
    }
})

app.get("/sdc/user/:userID/:query", authenticateToken, async (req, res) => {
    
    // Returns the COUNT of user total sent applications
    // can be filtered through specific criteria in fetchUserAppsCount args
    // EG: fetchUserAppsCount(id, approved, DSL) OR fetchUserAppsCount(id, ALL, ALL)

    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")

    try {
        const { service, status, date } = req.query
        const { userID, query } = req.params
        const dbQuery = await getDealerApplications(query, date, userID, status, service)
        res.status(200).json(dbQuery)
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.get("/sdc/applications/count", authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    try {
        const { interval } = req.query
        const result = await getSDCApplicationsCount(interval)
        console.log("RESULT: ", result)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
})

app.get("/sdc/user/:userID/applications/filterbydate/:query", authenticateToken, async (req, res) => {
    try {
        const { query } = req.params
        const { service, status, date } = req.query

    } catch (error) {
        console.log(error)
        return res.status(500).json("An error occurred while fetching applications according to date")
    }
})

// app.get("/sdc/user/:id/details", authenticateToken, async (req, res) => {
//     const userInfo = res.locals.userInfo
//     if (userInfo.role !== "sales_assistant_chef")
//         return res.status(401).json("this user does not have sales assistant premission")
//     const { service } = req.query
//     const { id } = req.params
//     try {
//         const result = await fetchUserAppsDetails(service, id)
//         console.log(result)
//         res.status(200).json(result)
//       } catch (e) {
//         console.log(e)
//         return res.status(500).json("An error occurred while attempting to update application")
//       }
// })

app.put("/test/:userID", async (req, res) => {
    const { userID } = req.params
    const { isActive } = req.body
    try {
        const query = await pool.query("UPDATE login SET  WHERE id = $1", [userID])
        res.status(200).json(query.rows[0])
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.get("*", async (req, res) => {
    return res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

const PORT = process.env.PORT || 8080
console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));