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

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname+'/client/build')));
app.use(express.static(path.join(__dirname+'/pages/enternewpass/build')));


pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })  


// app.post("/superuser", async (req, res) => {
//     try {
//         let token = generateAccessToken({username: "superuser", status: "admin"})
//         res.json({token})
//     } catch (error) {
//         console.error(error);
//     }
// });
app.post("/", authenticateToken, async (req, res) => {
    try {
        const dbUserTable = await pool.query("SELECT username, role FROM login WHERE username = $1", [res.locals.userInfo.username]);
        const { username, role } = dbUserTable.rows[0];
        console.log(role);
        return res.status(200).json({
            username: username,
            userRole: role,
        })
    } catch (error) {
        console.error(error);
    }
});

app.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        console.log('user attempting to login with values: ', username)
        let checkCredentialsResult = await checkCredentials(username, password)
        if (checkCredentialsResult.ok) {
            let token = generateAccessToken({username: username, role: checkCredentialsResult.userRole, userID: checkCredentialsResult.ID})
            // send myself an email on login, delete later
            // const emailData = {
            //     from: '<info@obexport.com>',
            //     to: "mohammad.nadom98@gmail.com",
            //     subject: 'Giriş yapıldı',
            //     text: `${username} ${new Date()} giriş yaptı`
            // }
            // mg.messages().send(emailData, (error, body) => {
            //     if (error) {
            //         console.error(error)
            //         return res.status(500).json("An error occurred during registeration")
            //     }
            //     console.log(body);
            // });
            //insert signin log
            await pool.query("INSERT INTO adminlogs (action, by, date) VALUES ('login', $1, CURRENT_TIMESTAMP)", [username])
            return res.status(200).json({
                token: token,
                username: checkCredentialsResult.username,
                userRole: checkCredentialsResult.userRole,
            });
        } else {
            return res.status(404).json("error ocurred while loggin in")
        }
    } catch (error) {
        console.error(error);
    }
});

// this code handles the registeration prodcedure by inserting a new record into the database
// that contains the user's info, and sends a verification link to the user's email.
app.post("/register", verifyRegisterRoute, async(req, res) => {
    try {
        const { username, password, dealerName, email } = req.body;

        const uniqueID = uniqid()
        const hash = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO register(username, password, email, verify_email_id, date, dealer_name) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5)",
         [username, hash, email, uniqueID, dealerName])
        app.render(__dirname + "/ejs/verifyemail.ejs", 
        {verifyEmailID: "https://b2b-iys.herokuapp.com/verifymail/" + uniqueID},
         (err, html) => {
            const emailData = {
                from: '<info@obexport.com>',
                to: email,
                subject: 'Mail adresinizi onaylayın',
                html: html
            }
            mg.messages().send(emailData, (error, body) => {
                if (error) {
                    console.error(error)
                    return res.status(500).json("An error occurred during registeration")
                }
                console.log(body);
                res.status(200).json("Register application is successful, awaiting client verification through client's email")
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json("error occurred at register route")
    }
});

//this code handles verifiying the email that was inserted in the database, and sent to the client's email. It takes the
//special ID generated in register route, and placed in the email template URL button as the main argument. Then proceeds
// to verify it. If verifications pass, the user's records gets inserted in the login table, which allows him to log in to
// the application
app.get("/verifymail/:emailID", async (req, res) => {
    const { emailID } = req.params
    const client = await pool.connect()
    try {
        const emailIDQuery = await client.query("SELECT * FROM register WHERE verify_email_id = $1", [emailID])
        if (emailIDQuery.rows.length === 0)
            return res.status(403).json("Your email verification ID has expired or doesn't exist")

        const { username, password, email, dealer_name } = emailIDQuery.rows[0]
        const userID = uniqid()

        await client.query('BEGIN')
        const insertUserQuery = await client.query("INSERT INTO login(username, hash, role, active, register_date, user_id, email, name) VALUES($1, $2, 'dealer', true, CURRENT_DATE, $3, $4, $5) RETURNING email",
         [username, password, userID, email, dealer_name])
        await client.query("DELETE FROM register WHERE email = $1",
         [insertUserQuery.rows[0].email])
        await client.query('COMMIT')

        return res.render(__dirname + '/ejs/emailVerified.ejs', {loginPage: "http://localhost:3000"})
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK')
        return res.status(500).json("An error occurred while attempting to update application")
      } finally {
        client.release()
      }
})


// This code handles resetting the client's password. it takes the client's email as the main
// argument. If the client's email exists in the database, it inserts a reset token into the
// database, and sends the same reset token to the client's email. The token expires in 1 hour
// If the client's email doesn't exist, it sends a 200 status anyways.
app.get("/resetpassword", async (req, res) => {
    const { email } = req.query

    const doesPrevResetToken = await pool.query("SELECT * FROM tempidstore WHERE pass_reset_for = $1", [email])

    // if client has alreacy submitted a reset request, invalidate the previous token
    if (doesPrevResetToken.rows !== 0)
        await pool.query("UPDATE tempidstore SET is_valid = false WHERE pass_reset_for = $1", [email])

    const emailIDQuery = await pool.query("SELECT * FROM login WHERE email = $1", [email])
    if (emailIDQuery.rows.length === 0)
        // I'm returning a fake response to protect a potential attacker from finding a user's email
        // in reality the query failed
        return res.status(200).json("Your account password reset query was successful, check incoming mail")
    const passResetToken = jwt.sign({for: email, date : new Date()}, process.env.TOKEN_SECRET, { expiresIn: 3600 });
    //insert token into database
    await pool.query("INSERT INTO tempidstore VALUES($1, CURRENT_DATE, true, $2)", [passResetToken, email])
    //send email with resetPassword HTML template that contains /resetpassword/:passResetToken link
    app.render(__dirname + "/ejs/resetPassword.ejs", 
    {resetPassPage: "https://b2b-iys.herokuapp.com/resetpassword/" + passResetToken},
     (err, html) => {
        const emailData = {
            from: 'İletişim<info@obexport.com>',
            to: email,
            subject: 'Şifre Resetleme',
            html: html
        }
        mg.messages().send(emailData, (error, body) => {
            if (error) {
                console.error(error)
                return res.status(500).json("An error occurred during password reset")
            }
            console.log(body);
            res.status(200).json("Your account password reset query was successful, check incoming mail")
        });
    })
})


// This code runs when the client clicks the link sent to his email in the EMAIL template
// that was sent by the /resetpassword route. If the token is valid, it renders a React
// build that allows the user to reset his password. If the token is invalid, it renders
// an HTML that tells the user the link was expired
app.get("/resetpassword/:passResetToken", async (req, res) => {
    const { passResetToken } = req.params
    if (passResetToken === null)
        return res.sendFile(path.join(__dirname+'/pages/passresetlinkexpired/index.html'));

    const isTokenValid = await pool.query("SELECT * FROM tempidstore WHERE pass_reset_id = $1", [passResetToken])
    if (!isTokenValid.rows[0])
        return res.sendFile(path.join(__dirname+'/pages/passresetlinkexpired/index.html'));
    
    if (isTokenValid.rows[0].is_valid === false)
        return res.sendFile(path.join(__dirname+'/pages/passresetlinkexpired/index.html'));

    jwt.verify(passResetToken, process.env.TOKEN_SECRET, async function(err, decoded) {
        if (err) {
            console.error(err)
            return res.status(403).json("Token authentication failed")
        } else {
            const email = decoded.for
            return res.sendFile(path.join(__dirname+'/pages/enternewpass/build/index.html'));
        }
    });
})


// This code handles the password reset procedure initialized by the previous GET route that
// sent the React build. It takes the original sent token as it's main argument. If validations
// pass, previous/all client's tokens get's deleted, and his database login hash get's updated
// according to his new password.
app.put("/resetpassword/:passResetToken", async (req, res) => {
    const { passResetToken } = req.params
    const { password } = req.body
    if (passResetToken === null)
        return res.sendStatus(401).json("Token was null")
    const isTokenValid = await pool.query("SELECT * FROM tempidstore WHERE pass_reset_id = $1", [passResetToken])
    console.log(isTokenValid.rows[0])
    if (!isTokenValid.rows[0])
        return res.status(403).json("Token has expired")
    
    if (isTokenValid.rows[0].is_valid === false)
        return res.status(403).json("Token has expired")

    jwt.verify(passResetToken, process.env.TOKEN_SECRET, async function(err, decoded) {
        if (err) {
            console.error(err)
            return res.status(403).json("Token authentication failed")
        } else {
            console.log("jwt token verification success, token: ", decoded)
            const email = decoded.for
            const hash = await bcrypt.hash(password, 10);
            const client = await pool.connect()
            try {
                await client.query('BEGIN')

                await client.query("DELETE FROM tempidstore WHERE pass_reset_for = $1", [email])
                await client.query("UPDATE login SET hash = $1 WHERE email = $2", [hash, email])

                await client.query('COMMIT')
                return res.status(200).json("Password reset successfull.")
            } catch (error) {
                console.log(error)
                await client.query('ROLLBACK')
                return res.status(500).json("An error occurred while resetting your password")
            } finally {
                client.release()
            }        
        }
    });
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