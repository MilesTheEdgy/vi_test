const jwt = require("jsonwebtoken")


function generateAccessToken(username, eczaneName) {
    const data = {
        username: username,
        pharmacyName: eczaneName,
        role : "eczane"
    }
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}
  
function authenticateToken(headers) {
    console.log('verifiying token...')
    const authHeader = headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        throw new Error("You do not have a session token")
    }
    let userData = {}
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            throw new Error("Your session token has expired")
        }
        userData = user
    })
    return userData
}

module.exports = {
    generateAccessToken,
    authenticateToken
}