/ eslint-disable linebreak-style /
let fs = require("fs");
const UserImage = require("../models/userimage");
const AWS = require("aws-sdk");
const CustomError = require("../../common/errors/custom-error");
const sharp = require("sharp");
var express = require("express");
var app = express();
const path = require("path");
app.use(express.static(path.resolve("./public")));

let BucketName = process.env.BUCKET;

let space = new AWS.S3({
  endpoint: process.env.ENDPOINT_URL,
  useAccelerateEndpoint: false,
  credentials: new AWS.Credentials(
    process.env.ACCESSKEYID,
    process.env.SECRETACCESSKEY,
    null
  ),
});

const userImagecontroller = {
  getAll: (userId, callback) => {
    UserImage.find({ userId: userId }, (err, docs) => {
      if (err) callback(err);
      else {
        callback(null, docs);
      }
    });
  },

  deleteImage: (req, callback) => {
    const url = process.env.BACK_BASE_URL;
    UserImage.findOneAndUpdate(
      { userId: req.decoded.userId },
      {
        $set: {
          userimage:  "profiles/pitchdbLogo.png",
        },
      },
      (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          UserImage.find({ userId: req.decoded.userId }, (errImg, docsimg) => {
            const param = {
              Bucket: BucketName,
              Key: docs.userimage,
            };
            space.deleteObject(param, function (err, data) {
              if (err) {
                console.log(err);
              } else {
                callback(null, docsimg);
              }
            });
          });
        }
      }
    );
  },
  addUserimage: (req, callback) => {
    UserImage.find({ userId: req.decoded.userId }, (err, docs) => {
      if (docs.length > 0) {
        var filename = docs[0].userimage && docs[0].userimage.split("/").pop();
        if (
          filename !== "pitchdbLogo.png"
        ) {
          const param = {
            Bucket: BucketName,
            Key: "profiles/" + filename,
          };
          space.deleteObject(param,function (err, data){
            console.log("profile removed",data)
          });
        }
      }

      if (!err && docs && docs.length > 0) {
        var userId = req.decoded.userId;
        UserImage.findOneAndUpdate(
          { userId: userId },
          {
            $set: {
              userimage: req.file.key,
            },
          },
          (err) => {
            if (err) callback(err);
            else callback(null, docs);
          }
        );
      } else {
        const url = process.env.BACK_BASE_URL;
        const user = new UserImage({
          userimage: req.file.key,
          userId: req.decoded.userId,
        });
        user.save(callback);
      }

    });
  },
};

module.exports = userImagecontroller;


