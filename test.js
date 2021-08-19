const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const cors = require("cors")
const dotenv = require('dotenv');
const cloudinary = require("cloudinary")
const mg = require("./mailgun/mailgun")

const app = express();

dotenv.config();
process.env.CLOUDINARY_NAME;
process.env.CLOUDINARY_API_KEY;
process.env.CLOUDINARY_API_SECRET;

app.use(cors())
app.use(express.json())

const handleError = (err, res) => {
  console.log(err)
  res.status(500).json("Oops! Something went wrong!")
};

const upload = multer({
  dest: path.join(__dirname, "./uploads")
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


app.post("/upload", upload.single("myFile"), (req, res) => {
    const uploadImage = () => {
      // console.log("route hit")
      const { file } = req
      // console.log("file from client ", file)
      const tempPath = file.path;
      const targetPath = path.join(__dirname, `./uploads/${file.originalname}`);
      // console.log("original 'temp' path: ", tempPath)
      // console.log("targetpath1 path: ", targetPath)
      const fileExtenstion = path.extname(file.originalname).toLowerCase() 
      if ( fileExtenstion === ".png" || fileExtenstion === ".jpg" || fileExtenstion === ".jpeg") {
        fs.rename(tempPath, targetPath, err => {
          if (err) 
              return handleError(err, res);
          cloudinary.v2.uploader.upload(targetPath, { public_id: "IYS_Sample" }, (error, result) => {
            if (error)
              console.log(error)
            else
              console.log(result); 
              res.status(200).json("File uploaded!")
          });
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) 
              return handleError(err, res);
          res.status(403).json("Only .png or .jpg files are allowed!")
        });
      }
    }
  }
);


app.post("/sendmail", async (req, res) => {
  app.render(__dirname + "/ejs/verifyemail.ejs", {verifyEmailID: "sadkjaskdj12312312asdjHAHAHAHA"}, (err, html) => {
    // const emailBody = fs.readFileSync(__dirname + "/temp.html").toString();
    const emailData = {
      from: '<info@obexport.com>',
      to: 'mohammad.nadom98@gmail.com',
      subject: 'testing',
      html: html
    }
    mg.messages().send(emailData, function (error, body) {
      if (error) {
        console.error(error)
        return res.status(500).json("didnt send :(")
      }
      console.log(body);
      res.status(200).json("it worked I think")
    });
  })
})

app.get("/test", async (req, res) => {
  fs.readFile(__dirname + "/temp.html", (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).json("an error occurred")
    }
    console.log(data)
    res.status(200).json("it worked check logs")
  })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Test Server is listening on port ${PORT}`);
});