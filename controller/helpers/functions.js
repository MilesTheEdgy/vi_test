const uniqid = require("uniqid")
const pool = require("../database")

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
// A function that compares two arrays to check if they have equal values(regardles
// of different sorting ) I recall using it for verifyObjKeys function.
const arrayCompare = (_arr1, _arr2) => {
    if (
      !Array.isArray(_arr1)
      || !Array.isArray(_arr2)
      || _arr1.length !== _arr2.length
      ) {
        return false;
      }
    
    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();
    
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
         }
    }
    
    return true;
}

const verifyReqObjExpectedObjKeys = (objKeysArr, reqObj, res) => {
    let requestObjArr = []
    for (const key in reqObj) {
        requestObjArr.push(key)
    }
    if (!arrayCompare(requestObjArr, objKeysArr)) {
        const errorStr = `Expected object keys: { ${objKeysArr} } GOT: { ${requestObjArr} } at ${__dirname}`
        return customStatusError(errorStr, res, 401, "Unexpected input")
    }
        
}

const switchServiceNameToTurkish = (service) => {
    let q_service = ""
    switch (service) {
        case "Faturasiz":
            q_service = "Faturasız"; break;
        case "Faturali":
            q_service = "Faturalı"; break;
        case "taahut":
            q_service = "Taahüt"; break;
        case "iptal":
            q_service = "İptal"; break;
        case "tivibu":
            q_service = "Tivibu"; break;
        default:
            q_service = service;
    }
    return q_service
}

// a query constructor specific to DATE queries
const queryConstructorDate = (selectStatement, conditionArr) => {
    let conditionText = ""
    for (let i = 0; i < conditionArr.length; i++) {
        if (i === 0)
            conditionText = ` WHERE ${conditionArr[i]} $${i+1}`
        else
            conditionText = conditionText + " AND " + conditionArr[i] + `$${i+1}`
    }
    return selectStatement + conditionText
}

const getDealerName = async (userID) => {
    const query = await pool.query("SELECT username FROM login WHERE user_id = $1", [userID])
    return query.rows[0].username
}


module.exports = {
    status500Error,
    customStatusError,
    verifyReqObjExpectedObjKeys,
    switchServiceNameToTurkish,
    queryConstructorDate,
    getDealerName
}