
const req = {body: {
    username: "asdas",
    password: "asdasd",
    something: "asdasdasd asdasdsdas"
}}

const reqBodyArr = Object.values(req.body)
const re = /\s/
for (let i = 0; i < reqBodyArr.length; i++) {
    if (re.test(reqBodyArr[i]))
        return console.log(false, " at index ", i, " value was ", reqBodyArr[i])
}
console.log(true)
