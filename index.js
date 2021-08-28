//are you okay brah
const fs = require("fs")
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

// dotenv.config();
// process.env.TOKEN_SECRET;

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
app.get("/dealer/applications/:query", authenticateToken, async (req, res) => {
    const { userID } = res.locals.userInfo
    // const dealerName = "ademiletişim"
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

app.get("/bayi/anasayfa", authenticateToken, async(req, res) => {
    try {
        let query = await loadAnasayfa(res.locals.userInfo.username, res.locals.userInfo.role)
        if (query.ok)
            return res.status(200).json(query.result)
        else
            return res.status(500).json("error at /bayi/anasayfa")
    } catch (error) {
        console.error(error)
        res.status(500).json("error at /bayi/anasayfa")
    }
})

app.post("/applications", authenticateToken, upload.array("image", 3), async(req, res) => {
    try {
        const handleError = (err, res) => {
            console.log(err)
            res.status(500).json("An error occurred during application submission")
        };

        const userInfo = res.locals.userInfo
        const { files } = req
        const { selectedService, selectedOffer, clientDescription, clientWantsRouter, clientName} = req.body;

        if (!selectedService || !clientDescription || !clientName)
            return res.status(403).json("one or more field was empty")

        console.log(files)
        console.log(req.body)
        const highestApplicationIDQuery = await pool.query("SELECT MAX(id) FROM sales_applications;")
        const highestApplicationID = highestApplicationIDQuery.rows[0].max
        for (let i = 0; i < files.length; i++) {
            const fileExtension = path.extname(files[i].originalname).toLowerCase() 
            console.log("fileExtension", fileExtension)
            const imageUniqID = `${userInfo.userID}-${uniqid.process()}`
            console.log("imageUniqID", imageUniqID);
            fs.renameSync(`${files[i].path}`, `${files[i].destination}/${imageUniqID+fileExtension}`);
        }
        const imageFolderPath = path.join(__dirname + "/uploads")
        console.log('imageFolderPath', imageFolderPath)
        let dbImageURLS = []
        fs.readdir(imageFolderPath, (err, filePaths) => {
            console.log('in READDIR function...')
            if (err)
                return handleError(err, res)
            console.log('passed readdir function, moving onto cloudinary upload loop...')
            console.log("filePaths", filePaths)
            for (let i = 0; i < filePaths.length; i++) {
                console.log('in cloudinary upload loop number ', i)
                cloudinary.uploader.upload(__dirname + "/uploads/" + filePaths[i], {
                     public_id: `iys/dealer_submissions/${userInfo.userID}/${highestApplicationID}/${filePaths[i].split('.').slice(0, -1).join('.')}`
                    }, async (err, result) => {
                    if (err) {
                        return handleError(err, res)
                    }
                    else {
                        console.log(result); 
                        dbImageURLS.push(result.secure_url)
                        console.log('deleting from storage...')
                        //send log
                        await pool.query("INSERT INTO adminlogs (action, by, date) VALUES ('sent application', $1, CURRENT_TIMESTAMP)", [userInfo.username])
                        fs.unlink(__dirname + "/uploads/" + filePaths[i], async err => {
                        if (err)
                            return handleError(err, res)
                        console.log('deleted')
                        console.log("dbImageURLS", dbImageURLS)
                        if (dbImageURLS.length === 3)
                            await sendApplication(userInfo, selectedService, selectedOffer, clientWantsRouter, clientDescription, clientName, dbImageURLS, res)
                        });
                    }
                });
            }
            // return res.status(200).json("an error occurred during application submission")
        })

    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

// app.get("/bayi/applications", authenticateToken, async(req, res) => {
//     try {
//         const username = res.locals.userInfo.username
//         const { status } = req.query
//         const response = await forDealerGetApplications(username, status)
//         res.status(200).json(response)
//     } catch (error) {
//         console.error(error)
//         res.status(500)
//     }
// })

// app.get("/applications/:applicationID", authenticateToken, async(req, res) => {
//     try {
//         // THIS ROUTE RETURNS ANY APPLICATION, ANY DEALER CAN ACCESS IT
//         // ADD SOME VERIFICATION HERE!!!!!!!!!!!!!!!!!!!!!!
//         //
//         //
//         //
//         console.log("route hit")
//         const { applicationID } = req.params
//         let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id = $1",
//         [applicationID])
//         console.log(query.rows)
//         res.status(200).json(query.rows)
//     } catch (error) {
//         console.error(error)
//         res.status(500)
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

app.put("/basvurular/:applicationID", authenticateToken, async (req, res) => {
    const client = await pool.connect()
    // if an ID that doesn't exist in database gets sent, nothing get's updated but no error get's triggered.
    const userInfo = res.locals.userInfo
    if (userInfo.role === "sales_assistant" || userInfo.role === "sales_assistant_chef") {
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