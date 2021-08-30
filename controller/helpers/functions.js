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

const verifyReqBodyExpectedObjKeys = (objKeysArr, req, res) => {
    let requestObjArr = []
    for (const key in req.body) {
        requestObjArr.push(key)
    }
    if (!arrayCompare(requestObjArr, objKeysArr)) {
        const errorStr = `Expected object keys: { ${objKeysArr} } GOT: { ${requestObjArr} } at ${__dirname}`
        return customStatusError(errorStr, res, 401, "Unexpected input")
    }
        
}

module.exports = {
    status500Error,
    customStatusError,
    verifyReqBodyExpectedObjKeys
}