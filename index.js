//are you okay brah
const Bree = require("bree")
const express = require("express");
const app = express();
const pool = require("./db");
const path = require("path")

const verifyRoute = require("./controller/routes/verify")
const generalRoute = require("./controller/routes/app")
const dealerRoute = require("./controller/routes/dealer")
const sdRoute = require("./controller/routes/sd")
const sdcRoute = require("./controller/routes/sdc")

const bree = new Bree({
    jobs: [
      {
        name: 'printreport',
        cron: "0 2 1 * *"
      }
    ]
  });
bree.start();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static("public"));
app.use(verifyRoute)
app.use(generalRoute)
app.use(dealerRoute)
app.use(sdRoute)
app.use(sdcRoute)

pool.on('connect', client => {
    console.log('Database connection established')
})
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})

const PORT = process.env.PORT || 8080
console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));