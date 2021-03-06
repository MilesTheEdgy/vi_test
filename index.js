//are you okay brah
const Bree = require("bree");
const express = require("express");
const app = express();
const pool = require("./controller/database");
const path = require("path");

const verifyRoute = require("./controller/routes/verify");
const generalRoute = require("./controller/routes/app");
const dealerRoute = require("./controller/routes/dealer");
const sdRoute = require("./controller/routes/sd");
const sdcRoute = require("./controller/routes/sdc");
const morgan = require("morgan")

function startServer() {
  const bree = new Bree({
    jobs: [
      {
        name: "printreport",
        cron: "0 2 1 * *",
      },
    ],
  });
  bree.start();
  // console.log('the express static path used is: ', path.join("client", "build"))
  console.log('the express static path that was used: ', path.join(__dirname, "client", "temp"))
  app.use(morgan('combined'))
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "client", "temp")));
  app.use(verifyRoute);
  app.use(generalRoute);
  app.use(dealerRoute);
  app.use(sdRoute);
  app.use(sdcRoute);
  
  app.get("/api/sendclientbuild", (req, res) => {
    console.log('SENDING CLIENT BUILD: ', path.join(__dirname, "client", "build", "index.html"))
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
  app.get("/api/testresponse", (req, res) => {
    console.log("SENDING A COMMON STRING")
    res.json("this route is working, check logs")
  });
  app.get("/api/sendtest", (req, res) => {
    console.log('SENDING TEST HTML')
    res.sendFile(path.join(__dirname, "test","index.html"));
  })

  // app.get("*", (req, res) => {
  //   console.log('WILDCARD, sending TEST INDEX')
  //   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  // });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
}


async function connectDB() {
  let retries = 5;
  while (retries) {
    try {
      const client = await pool.connect();
      await client.query("SELECT NOW()");
      console.log("connected to database");
      client.release();
      // Start express server
      startServer();
      break;
      
    } catch (error) {
      console.log("Postgres database error: ", error);
      retries -= 1;
      console.log("retries left: " + retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

(async function () {
  // MAIN
  // Establish a database connection
  await connectDB();
})();
