const uniqid = require("uniqid")

const status500Error = (err, res, resErrorString) => {
    console.log(err)
    const errorDate = new Date()
    const errorID = uniqid("ERROR-ID-")
    console.log("-*-*-*-" + errorID + " DATE: ", errorDate)
    return res.status(500).json(resErrorString  + " " + errorID)
}
const customStatusError = (err, res, resStatus, resErrorString) => {
    console.log(err)
    const errorDate = new Date()
    const errorID = uniqid("ERROR-ID-")
    console.log("-*-*-*-" + errorID + " DATE: ", errorDate)
    return res.status(resStatus).json(errorID + " " + resErrorString)
}

module.exports = {
    status500Error,
    customStatusError
}