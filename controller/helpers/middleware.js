const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()

process.env.TOKEN_SECRET

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


module.exports = {
    authenticateToken
}