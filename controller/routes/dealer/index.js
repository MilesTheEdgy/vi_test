const fs = require("fs")
const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const multer = require("multer")
const cloudinary = require("cloudinary").v2
// const client = require("./db");
const pool = require("./db");
const mg = require("./mailgun/mailgun")
const uniqid = require('uniqid');
const {
    authenticateToken,
    checkCredentials,
    generateAccessToken,
    loadAnasayfa,
    sendApplication,
    verifyRegisterRoute
} = require("./functions");

const { 
    fetchUserAppsCount,
    getDealerApplications,
    getSDCApplicationsCount
} = require("./database/queries")
const { 
    forDealerGetApplications,
} = require("./database/dealerqueries")

dotenv.config();
process.env.TOKEN_SECRET;


const app = module.exports = express();