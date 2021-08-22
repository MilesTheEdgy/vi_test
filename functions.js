const bcrypt = require("bcrypt");
// const client = require("./db");
const fs = require("fs");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const multer = require("multer");
const cloudinary = require("cloudinary")

dotenv.config();
process.env.TOKEN_SECRET;
process.env.CLOUDINARY_NAME;
process.env.CLOUDINARY_API_KEY;
process.env.CLOUDINARY_API_SECRET;

const checkCredentials = async (clientUsername, clientPassword) => {
    try {
        console.log("in function, values", clientUsername, clientPassword)
        const dbUserTable = await pool.query("SELECT username, hash, role, user_id FROM login WHERE username = $1", [clientUsername]);
        const dbUsername = dbUserTable.rows[0]?.username;
        const dbUserHash = dbUserTable.rows[0]?.hash;
        const dbUserRole = dbUserTable.rows[0]?.role;
        const dbUserID = dbUserTable.rows[0]?.user_id;
        if (dbUsername === clientUsername) {
            let hashResult = await bcrypt.compare(clientPassword, dbUserHash);
            if (hashResult) {
                console.log(hashResult ,dbUsername, dbUserRole, dbUserID)
                return {ok: hashResult, username: dbUsername, userRole: dbUserRole, ID: dbUserID}
            } else {
                return {ok: hashResult}
            }
        } else {
            return {ok: false}
        }
        
    } catch (error) {
        console.error(error);
    }
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 1800 });
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // console.log("ORIGINAL COOKIE: ", authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    // console.log("MODIFIED COOKIE: ", token)
    console.log('Authenticating token...')
    if (token == null) return res.sendStatus(401).json("Token was null")
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.error("AN ERROR OCCURRED WHEN VERIFYING TOKEN: ", err)
            return res.status(403).json("USER AUTHENTICATION failed")
        } else {
            console.log("Success", decoded)
            res.locals.userInfo = {username: decoded.username, role: decoded.role, userID: decoded.userID};
            next()
        }
    });
}

const loadAnasayfa = async (username, role) => {
    try {
        switch(role) {
            case "bayi":
                const dbUserTable = await pool.query("SELECT unsold_devices, urgent_paperwork, this_month_sales, this_year_sales FROM bayi_ui WHERE username = $1", [username]);
                return {ok: true, result: dbUserTable.rows[0]}
            default:
                return {ok: false} //check this block
        }      
    } catch (error) {
        console.error(error)
        return {ok: false}
    }
}
    
const sendApplication = async (userInfo, selectedService, selectedOffer, clientWantsRouter, clientDescription, clientName, res) => {
    console.log("client name is: ", clientName);
    if (!selectedService.match(/^(DSL|Taahüt|Tivibu|PSTN|İptal|Nakil|Devir)$/)) {
        console.error("Selected service doesn't match the criteria");
        return res.status(406).json("Selected service doesn't match the criteria")
    }
    if (!clientName || !clientDescription || !selectedService) {
        console.error("one of the form values were empty");
        return res.status(406).json("one of the form values were empty")
    }
    const { username, role } = userInfo;
    if (role !== "bayi") {
        console.error("user does not have premission to submit");
        return res.status(401).json("user does not have premission to submit")
    }
    const d = new Date()
    // const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`    // 2016-06-22 19:10:25
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        //begin the query transaction
        const query = await client.query("INSERT INTO sales_applications(submitter, submit_time, activator, representative, client_name, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING id"
            , [username, 'CURRENT_TIMESTAMP', "Abdullah Kara", "Erdem Mutlu", clientName, 'processing'])
        await client.query("INSERT INTO sales_applications_details(client_name, selected_service, selected_offer, description, client_wants_router, id) VALUES($1, $2, $3, $4, $5, $6)"
            , [clientName, selectedService, selectedOffer, clientDescription, clientWantsRouter, query.rows[0].id])
        await client.query('COMMIT')
        //end the query transaction

        return res.status(200).json("application submitted successfully")
    }
     catch (e) {
        await client.query('ROLLBACK')
        console.error(e)
        return res.status(500).json("an error occurred from the server side")
    }
     finally {
        client.release()
    }
}

const uploadImage = () => {
    const upload = multer({
        dest: path.join(__dirname, "./uploads")
        // you might also want to set some limits: https://github.com/expressjs/multer#limits
      });
      
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    const handleError = (err, res) => {
        console.log(err)
        res.status(500).json("Oops! Something went wrong!")
      };
    // console.log("route hit")
    const { file } = req
    // console.log("file from client ", file)
    const tempPath = file.path;
    const targetPath = path.join(__dirname, `./uploads/${file.originalname}`);
    // console.log("original 'temp' path: ", tempPath)
    // console.log("targetpath1 path: ", targetPath)
    const fileExtenstion = path.extname(file.originalname).toLowerCase() 
    if ( fileExtenstion === ".png" || fileExtenstion === ".jpg" || fileExtenstion === ".jpeg") {
      fs.rename(tempPath, targetPath, err => {
        if (err) 
            return handleError(err, res);
        cloudinary.v2.uploader.upload(targetPath, { public_id: "IYS_Sample" }, (error, result) => {
          if (error)
            console.log(error)
          else
            console.log(result); 
            res.status(200).json("File uploaded!")
        });
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) 
            return handleError(err, res);
        res.status(403).json("Only .png or .jpg files are allowed!")
      });
    }
  }


const verifyRegisterRoute = async (req, res, next) => {
    try {
        const {username, password, dealerName, email} = req.body
        if (!username || !password || !dealerName || !email)
            return res.status(403).json("Your input verifications failed to pass")
        if (username === "" || password === "" || dealerName === "" || email === "")
            return res.status(403).json("Your input verifications failed to pass")
        //verify the email
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email) === false)
            return res.status(403).json("Your input verifications failed to pass")
        // check if email exists
        const emailQuery = await pool.query("SELECT email FROM login WHERE email = $1", [email])
        if (emailQuery.rows.length !== 0) 
            return res.status(406).json("This user already exists")
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json("an error occurred while attempting to register user")
    }
} 


module.exports = {
    checkCredentials, 
    generateAccessToken, 
    authenticateToken, 
    loadAnasayfa, 
    sendApplication, 
    verifyRegisterRoute
}