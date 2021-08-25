const pool = require("../../database/");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();
process.env.TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log('Authenticating token...')
    if (token == null) return res.sendStatus(401).json("Token was null")
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.error("AN ERROR OCCURRED WHEN VERIFYING TOKEN: ", err)
            return res.status(403).json("USER AUTHENTICATION failed")
        } else {
            res.locals.userInfo = {username: decoded.username, role: decoded.role, userID: decoded.userID};
            next()
        }
    });
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
    authenticateToken,
    verifyRegisterRoute
}