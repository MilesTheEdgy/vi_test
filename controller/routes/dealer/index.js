const fs = require("fs")
const express = require("express");
const path = require("path");
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const pool = require("../../database");
const uniqid = require('uniqid');
const { authenticateToken } = require("../../helpers/middleware")
const { sendApplication } = require("./functions");
const { status500Error, customStatusError, verifyServiceNameFromInput } = require("../../helpers/functions");
const { verifyReqBodyObjValuesNotEmpty } = require("../../helpers/middleware");

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

const app = module.exports = express();

app.post("/applications", authenticateToken, verifyReqBodyObjValuesNotEmpty, upload.array("image", 3), async(req, res) => {
    try {
        if (userInfo.userRole !== "dealer")
            return customStatusError("user does not have premission to submit", res, 401, "user does not have premission to submit")
        const userInfo = res.locals.userInfo
        const { files } = req
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
                return status500Error(err, res, "An error occurred while uploading your application")
            console.log('passed readdir function, moving onto cloudinary upload loop...')
            console.log("filePaths", filePaths)
            for (let i = 0; i < filePaths.length; i++) {
                console.log('in cloudinary upload loop number ', i)
                cloudinary.uploader.upload(__dirname + "/uploads/" + filePaths[i], {
                     public_id: `iys/dealer_submissions/${userInfo.userID}/${highestApplicationID}/${filePaths[i].split('.').slice(0, -1).join('.')}`
                    }, async (err, result) => {
                    if (err) {
                        return status500Error(err, res, "An error occurred while uploading your application")
                    }
                    else {
                        console.log(result); 
                        dbImageURLS.push(result.secure_url)
                        console.log('deleting from storage...')
                        //send log
                        await pool.query("INSERT INTO adminlogs (action, by, date) VALUES ('sent application', $1, CURRENT_TIMESTAMP)", [userInfo.username])
                        fs.unlink(__dirname + "/uploads/" + filePaths[i], async err => {
                        if (err)
                            return status500Error(err, res, "An error occurred while uploading your application")
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

app.get("/balance", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    try {
        const query = await pool.query("SELECT balance FROM login WHERE user_id = $1", [userInfo.userID])
        return res.status(200).json(query.rows[0])
    } catch (err) {
        return status500Error(err, res, "server error could not fetch your balance")
    }
})


app.get("/testingsend", async (req, res) => {
    const obj = {
        userInfo: {
            userID: "1fa5915jwksg069fe",
            userRole: "sales_assistant_chef",
            name: "Adem İletişim"
        },
        selectedService: "Tivibu" ,
        selectedOffer: "Tivibu Kampanyası",
        clientWantsRouter: 0,
        clientDescription: "Tivibu kampanyası birşeyler",
        clientName: "Tivibu Alacak Abi",
        photoURLS: ["asdasd", "sdaasdsad", "sadasdas"]
    }
    const {userInfo, selectedService, selectedOffer, clientWantsRouter, clientDescription, clientName, photoURLS} = obj
    isServiceVerifed = await verifyServiceNameFromInput(selectedService)
    console.log('in SEND APPLICATION')
    const { name, role, userID } = userInfo;
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        //begin the query transaction

        const query = await client.query("INSERT INTO sales_applications(submitter, submit_time, activator, client_name, status) VALUES($1, $2, $3, $4, $5) RETURNING id"
            , [name, 'NOW()', "CHANGE ME", clientName, 'sent'])
        await client.query("INSERT INTO sales_applications_details(client_name, selected_service, selected_offer, description, client_wants_router, id, image_urls) VALUES($1, $2, $3, $4, $5, $6, $7)"
            , [clientName, selectedService, selectedOffer, clientDescription, clientWantsRouter, query.rows[0].id, photoURLS])

        const checkGoalSuccessStatement = "SELECT goal, done, goal_id FROM goals WHERE EXTRACT(month from for_date) = (SELECT date_part('month', (SELECT current_timestamp))) AND service = $1 AND for_user_id = $2"
        const checkGoalSuccessQuery = await client.query(checkGoalSuccessStatement, [selectedService, userID])
        if (checkGoalSuccessQuery.rowCount === 1) {
            if (checkGoalSuccessQuery.rows[0].done === checkGoalSuccessQuery.rows[0].goal)
                await pool.query("UPDATE goals SET success = true, done = done + 1 WHERE goal_id = $1", [checkGoalSuccessQuery.rows[0].goal_id])
            else {
                await pool.query("UPDATE goals SET done = done + 1 WHERE goal_id = $1", [checkGoalSuccessQuery.rows[0].goal_id])
            }
        }

        await client.query('COMMIT')
        //end the query transaction
        res.json("done")
    }
     catch (e) {
        await client.query('ROLLBACK')
        console.error(e)
    }
     finally {
        client.release()
    }
})