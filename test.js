const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const cors = require("cors")
const dotenv = require('dotenv');
const cloudinary = require("cloudinary")

const app = express();

dotenv.config();
process.env.CLOUDINARY_NAME;
process.env.CLOUDINARY_API_KEY;
process.env.CLOUDINARY_API_SECRET;

app.use(cors())

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
    console.log("route hit")
    const { file } = req
    console.log("file from client ", file)
    res.status(200).json("File uploaded!")
    // const tempPath = file.path;
    // const targetPath1 = path.join(__dirname, `./uploads/${file.originalname}`);
    // console.log("original 'temp' path: ", tempPath)
    // console.log("targetpath1 path: ", targetPath1)
    // fs.rename(tempPath, targetPath1, err => {
    //   if (err) 
    //       return handleError(err, res);
    //     res.status(200).json("File uploaded!")
    //   });
    

    // cloudinary.v2.uploader.upload(
    //   "https://www.example.com/mysample.jpg",
    //   { public_id: "sample_woman" },
    //   (error, result) => {
    //     if (error)
    //       console.log(error)
    //     else
    //       console.log(result); 
    //   });

    // if (path.extname(file.originalname).toLowerCase() === ".png") {
    //   fs.rename(tempPath, targetPath, err => {
    //     if (err) 
    //         return handleError(err, res);
    //     res.status(200).json("File uploaded!")
    //   });
    // } else {
    //   fs.unlink(tempPath, err => {
    //     if (err) 
    //         return handleError(err, res);
    //     res.status(403).json("Only .png files are allowed!")
    //   });
    // }
  }
);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Test Server is listening on port ${PORT}`);
}); 

// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
// app.get("/", express.static(path.join(__dirname, "./public")));