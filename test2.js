
const req = {body: {
    username: "milo",
    password: "",
    name: "asdasd"
}}

const findObjKeyAndRtrnErrorString = (arrIndex) => {
    let i = 0
    for (const key in req.body) {
        if (i === arrIndex) 
            return console.log("key", key, "at req.body was empty")
        i++
    }
}
const reqBodyArr = Object.values(req.body)
for (let i = 0; i < reqBodyArr.length; i++) {
    if (reqBodyArr[i] === "")
        return findObjKeyAndRtrnErrorString(i)
}