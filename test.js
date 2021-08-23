const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const cors = require("cors")
const dotenv = require('dotenv');
const cloudinary = require("cloudinary").v2
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

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'uploads', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_yoyo_' + Date.now() 
           + path.extname(file.originalname))
  }
});
const upload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      // console.log("multer -- req: ", req)
      // console.log("multer -- file: ", file)
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
        return cb(new Error('Please upload an Image'))
      }
    cb(undefined, true)
  }
})

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

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

app.post("/upload", upload.single("image"), (req, res) => {
    console.log('attempting to add an image alongside other body')
    console.log(req.body)
    console.log(req.file)
    const { file } = req
    console.log("uploading to cloudinary")
    cloudinary.uploader.upload(file.path, { public_id: `iys/${file.originalname}` }, (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).json("upload to cloudinary error")
      }
      else {
        console.log(result); 
        console.log('deleting from storage...')
        fs.unlink(file.path, err => {
          if (err)
              return handleError(err, res);
          console.log('deleted')
          return res.status(200).json("I think its uploaded?")
        });
      }
    });
    const uploadImage = () => {
      const { file } = req
      console.log("file from client ", file)
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
            });
            res.status(200).json("File uploaded!")
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) 
              return handleError(err, res);
          res.status(403).json("Only .png or .jpg files are allowed!")
        });
      }
    }
    // uploadImage()
  });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Test Server is listening on port ${PORT}`);
});