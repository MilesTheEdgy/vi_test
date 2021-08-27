const uniqid = require("uniqid")

const status500Error = (err, res, resErrorString) => {
    const errorID = uniqid("ERROR-ID-")
    const errorDate = new Date()
    console.log("-*-*-*-" + errorID + " DATE: ", errorDate + " " + err)
    return res.status(500).json(resErrorString  + " " + errorID)
}
const customStatusError = (err, res, resStatus, resErrorString) => {
    const errorID = uniqid("ERROR-ID-")
    const errorDate = new Date()
    console.log("-*-*-*-" + errorID + " DATE: ", errorDate + " " + err)
    return res.status(resStatus).json(errorID + " " + resErrorString)
}

module.exports = {
    status500Error,
    customStatusError
}