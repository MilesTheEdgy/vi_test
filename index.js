const express = require("express");
const path = require("path")
/** Bree for setting up a function that runs every month */
const Bree = require("bree")

const app = express();

/**
 * @name verifyRoute: These routes handles user verification and authentication, such as login, registering, password resetting email verification etc...
 * @name generalRoute These routes handle general common tasks such as data fetch requests with GET; and tasks available for all roles
 * @name dealerRoute These routes handle functions made by user with 'dealer' role
 * @name sdRoute These routes handle functions made by user with 'Sales Assistant' role
 * @name sdcRoute These routes handle functions made by user with 'Sales Assistant Chef' role
*/
const verifyRoute = require("./controller/routes/verify")
const generalRoute = require("./controller/routes/app")
const dealerRoute = require("./controller/routes/dealer")
const sdRoute = require("./controller/routes/sd")
const sdcRoute = require("./controller/routes/sdc")



/** Define job file
 *  @lends printreport will look for a 'jobs' directory that has printreport.js
 *  @lends cron this cron translates to 'every start of the month'
 *  @method start starts bree jobs
 */
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

/** Render '/client/build' static directory */
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static("public"));

/** call express use middleware on the rest of the routes */
app.use(verifyRoute)
app.use(generalRoute)
app.use(dealerRoute)
app.use(sdRoute)
app.use(sdcRoute)

/** Send static build in /client/build */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));