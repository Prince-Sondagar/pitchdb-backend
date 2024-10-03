/* eslint-disable linebreak-style */
const router = require("express").Router();
const userImagecontroller = require("../../modules/userimage/controllers/userimage");
const routeInterceptor = require("../../modules/common/interceptors/route-interceptor");
const handleStandard = require("../../modules/common/util/handle-standard");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk");

let express = require("express"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  { v4: uuidv4 } = require('uuid');

let s3client = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  credentials:{
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY
  }
});

// Configure Multer-S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3client,
    bucket: process.env.BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, "profiles/" + uuidv4() + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

router.all("/*", routeInterceptor.verifyToken);
router.all("/*", routeInterceptor.verifySessionValidity);

router.get("/", (req, res, next) => {
  userImagecontroller.getAll(req.decoded.userId, (err, sequences) => {
    handleStandard(req, res, err, sequences, next);
  });
});
router.post("/delete-userimage", (req, res, next) => {
  userImagecontroller.deleteImage(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  });
});

router.post("/add-userimage", upload.single("profileImg"), (req, res, next) => {
  userImagecontroller.addUserimage(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  });
});

module.exports = router;
