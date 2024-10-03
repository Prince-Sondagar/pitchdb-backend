/* eslint-disable linebreak-style */
const User = require("../models/user");
const Counter = require("../../credits/models/counter");

const CustomError = require("../../common/errors/custom-error");

const userCredentialsController = require("./user-credential");
const listController = require("../../lists/controllers/list");
const counterController = require("../../credits/controllers/counter");
const authenticationController = require("./authentication");

const async = require("async");

const PAGE_SIZE = 10;
const Privilege = require("../../common/constants/users/permissions");

const adminUserController = {
  getAllUsers: (req, callback) => {
    let query = {};
    if (req.query.term) {
      query = {
        $or: [
          { name: { $regex: req.query.term, $options: "i" } },
          { email: { $regex: req.query.term, $options: "i" } }
        ]
      };
    }
    User.find(query)
      .sort("-dateLastLogin")
      .lean()
      .limit(PAGE_SIZE)
      .skip(req.query.page ? req.query.page * PAGE_SIZE : 0)
      .exec((err, users) => {
        if (err) callback(err);
        else async.map(users, getUserCredits, callback);
      });
  },

  countUsers: (req, callback) => {
    let query = {};
    if (req.query.term) {
      query = {
        $or: [
          { name: { $regex: req.query.term, $options: "i" } },
          { email: { $regex: req.query.term, $options: "i" } }
        ]
      };
    }
    User.countDocuments(query).exec((err, count) => {
      if (err) callback(err);
      else callback(null, { count: count, pageSize: PAGE_SIZE });
    });
  },

  createUser: (userData, callback) => {
    userData.signupEmail = userData.email;
    let newUser = new User({...userData, privileges: ['allAccess']});
    newUser.save((err, user) => {
      if (err) callback(err);
      else {
        listController.createDefaultList(user, err => {
          if (err) callback(err);
          else {
            counterController.createCounter(user._id, null, 5, err => {
              if (err) callback(err);
              else {
                userCredentialsController.sendUserPassword(user, true, err => {
                  if (err) callback(err);
                  else callback(null, user);
                });
              }
            });
          }
        });
      }
    });
  },

  deleteUser: (userId, callback) => {
    User.findByIdAndRemove(userId, callback);
  },

  resendNewPassword: (userId, callback) => {
    User.findById(userId, (err, user) => {
      if (err) callback(err);
      else if (!user) callback(new CustomError("User not found"), 404);
      else {
        userCredentialsController.sendUserPassword(user, false, callback);
      }
    });
  },

  getUserLoginToken: (req, callback) => {
    User.findById(req.params.id, (err, user) => {
      if (err) callback(err);
      else if (!user) callback(new CustomError("User not found"), 404);
      else if (user.disabled)
        callback(new CustomError("User is disabled"), 418);
      else {
        if (!user.token) {
          const token = authenticationController.generateJWT(user);

          User.findOneAndUpdate({ _id: user._id }, { jwtToken: token }, err => {
            if (err) callback(err);
            else callback(null, token);
          });
        } else {
          callback(null, user.token);
        }
      }
    });
  },

  statusToggle: (userId, callback) => {
    User.findById(userId, (err, user) => {
      if (err) callback(err);
      else if (!user) callback(new CustomError("User not found"), 404);
      else {
        User.findOneAndUpdate(
          { _id: userId },
          { disabled: !user.disabled, jwtToken: "" },
          err => {
            if (err) callback(err);
            else callback();
          }
        );
      }
    });
  },

  addPrivilege: (userId, privilege, callback) => {
    if (!privilege) callback(new CustomError("Privilege can't be empty"), 400);
    User.findById(userId, (err, user) => {
      if (err) callback(err);
      else if (!user) callback(new CustomError("User not found"), 404);
      else {
        let privileges = user.privileges || [];
        let addedPrivileges = user.addedPrivileges || [];

        const index = user.privileges.indexOf(privilege);
        if (index < 0) {
          privileges.push(privilege);
          addedPrivileges.push(privilege);

          User.findOneAndUpdate(
            { _id: userId },
            {
              privileges: privileges,
              addedPrivileges: addedPrivileges,
              jwtToken: ""
            },
            err => {
              if (err) callback(err);
              else callback();
            }
          );
        } else
          callback(
            new CustomError(`User already has ${privilege} privilege`),
            400
          );
      }
    });
  },

  getPrivilegelist: (req, callback) => {
    callback(null, Privilege);
  },

  removePrivilege: (userId, privilege, callback) => {
    if (!privilege) callback(new CustomError("Privilege can't be empty"), 400);
    User.findById(userId, (err, user) => {
      if (err) callback(err);
      else if (!user) callback(new CustomError("User not found"), 404);
      else {
        if (user.privileges) {
          const index = user.privileges.indexOf(privilege);
          if (index > -1) {
            user.privileges.splice(index, 1);
            User.findOneAndUpdate(
              { _id: userId },
              {
                privileges: user.privileges || [],
                jwtToken: ""
              },
              err => {
                if (err) callback(err);
                else callback();
              }
            );
          } else
            callback(
              new CustomError(`User doesn't have ${privilege} privilege`),
              400
            );
        }
      }
    });
  },

  adminAssigntemplate : (req, callback) => {
    let user_id = req.params.id;
    let template_id = req.body.templateid;
      User.findOneAndUpdate({ _id: user_id }, { adminEmailtemplateid: template_id }, err => {
      if (err) callback(err);
      else callback();
    });
  }
  
};

const getUserCredits = (user, callback) => {
  let filterObj = {};
  const { teamId, _id } = user;
  if (teamId) filterObj.teamId = teamId;
  else filterObj.userId = _id;
  Counter.findOne(filterObj, (err, counter) => {
    if (err) callback(err);
    else if (!counter) callback(null, user);
    else {
      user.credits = {
        remaining: counter.remaining,
        used: counter.used
      };
      callback(null, user);
    }
  });
};



module.exports = adminUserController;
