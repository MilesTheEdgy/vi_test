
const req = {body: {
    username: "milo",
    password: "asd",
    name: "asdasd"
}}

// const findObjKeyAndRtrnErrorString = (arrIndex) => {
//     let i = 0
//     for (const key in req.body) {
//         if (i === arrIndex) 
//             return console.log("key", key, "at req.body was empty")
//         i++
//     }
// }
// const reqBodyArr = Object.values(req.body)
// for (let i = 0; i < reqBodyArr.length; i++) {
//     if (reqBodyArr[i] === "")
//         return findObjKeyAndRtrnErrorString(i)
// }

function arrayCompare(_arr1, _arr2) {
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

const verifyObjKeys = (objKeysArr) => {
    let requestObjArr = []
    for (const key in req.body) {
        console.log('REQBODY KEY ', key)
        requestObjArr.push(key)
    }
    console.log('request obj arr: ', requestObjArr)
    console.log('expected obj arr: ', objKeysArr)
    if (arrayCompare(requestObjArr, objKeysArr))
        console.log('   SUCCESS!!!')
    else
        console.log('   FALSE!!!')
}

verifyObjKeys(["password", "username", "name"])