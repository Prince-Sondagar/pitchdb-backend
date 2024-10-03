/* eslint-disable linebreak-style */
const Emailtemplates = require('../models/email-template');
const CustomError = require('../../common/errors/custom-error');
const gmailController = require("../../../modules/outreach/controllers/gmail");
const outlookController = require("../../../modules/outreach/controllers/outlook");
const mailController = require("../../../modules/outreach/controllers/mail");
const EmailAccount = require("../../users/models/email-account");
const mailConstants = require("../../../modules/outreach/constants/mail");
const axios = require('axios');
const emailTemplatecontroller = {

  getAll: (userId, callback) => {
    Emailtemplates.find({userId: userId}, (err, docs) => {
      if (err) callback(err);
      else {
        callback(null, docs);
      }
    })
  },

  getEmailReport: (req, callback) => {
    Emailtemplates.findById(req.params.id, (err, docs) => {
      if (err) callback(err);
      else {
        callback(null, docs);
      }
    })
  },

  getById: (seqId, userId, callback) => {
    Emailtemplates.findOne({ _id: seqId, userId: userId }).populate('userPodcastId').populate('userSpeakerId').populate('userPodcastEpisodeId')
      .populate('userEventOrganizationId').populate('userConferenceId').populate('userBusinessId').populate('userMediaOutletId').populate('userGuestId').lean().exec((err, doc) => {
        if (err) callback(err);
        else callback(null, doc);
      })
  },

  updateEmailtemplates: (outreachId, updateObj, callback) => {
    Emailtemplates.findByIdAndUpdate(outreachId, updateObj, callback);
  },

  

  createEmailReport: (req, callback) => {
    const newEmailReport = new EmailReport(req.body);
    newEmailReport.save(callback);
  },

  addEmailtemplate: (req, callback) => { 
   let emailtemplates = [];
    emailtemplates.push(req.body);
    const newEmailtemplates = new Emailtemplates({ emailtemplate: emailtemplates,  userId: req.decoded.userId });
    newEmailtemplates.save(callback);
  },

  editEmailtemplate: (req, callback) => { 

    Emailtemplates.findOne({ _id: req.params.id }, (err, sequence) => {
      if (err) callback(err);
      else if (!sequence) callback(new CustomError('Not found', 404));
      else{

        Emailtemplates.findOneAndUpdate(
          { "_id": req.params.id, "emailtemplate._id": req.params.idNote}, 
          {
            "$set": {
              "emailtemplate.$.content": req.body.content,
              "emailtemplate.$.subject": req.body.subject,
              "emailtemplate.$.date": req.body.date,
              "emailtemplate.$.editDate": req.body.editDate
            }
          }, err => {
            if (err) callback(err);
            else
              callback(null, sequence);
          }
        )
      } 
    })
  },

  removeEmailtemplate: (req, callback) => { 
    Emailtemplates.findOne({ _id: req.params.id }, (err, sequence) => {
      if (err) callback(err);
      else if (!sequence) callback(new CustomError('Not found', 404));
      else{
        sequence.emailtemplate.id(req.params.idNote).remove();
        sequence.save(function (err) {
          
          if (err){
            callback(err);
          }
          else callback(null, "Email Template removed successfully");
        });
      } 
    })
  },

  senEmail:(req, callback) =>
  {
    let emailObj;
    let requestUrl;
    let emailData = {};
    emailData.from = req.body.emaiAccountdata.email
    emailData.to = req.body.emailval
    emailData.subject = req.body.subject || "Test Email From Pitchdb"
    emailData.senderName = req.body.emaiAccountdata.name
    emailData.message = req.body.message

    
    EmailAccount.findOne({email: req.body.emaiAccountdata.email}, (err, emailAccount) => {
      if (err) {
        return callback(err);
      }
      if (!emailAccount) {
        return callback(
          new CustomError(
            "No email connected for sending messages, please configure one in your account's configuration.",
            460
          )
        );
      }
      else{
        mailController.checkTokenValidity(emailAccount, callback);
        switch (emailAccount.network) {
          case mailConstants.GMAIL:
            emailObj = { raw: gmailController.buildRfc2822Base64(emailData) };
            requestUrl = mailConstants.GOOGLE_BASE_URL + "users/me/messages/send";
            break;
          case mailConstants.OUTLOOK:
            emailObj = outlookController.buildMailBody(emailData);
            requestUrl = mailConstants.MICROSOFT_BASE_URL + "sendMail";
            break;
          default:
            callback(new CustomError('Invalid network', 400));
            return;
        }
    
        const authString = 'Bearer ' + emailAccount.emailToken;
        axios.post(requestUrl, emailObj, { headers: { Authorization: authString } })
          .then(response => {
           
            // It is necessary to call the microsoft API after sending the message so the email token must be checked again 
            // in case enough time has passed and the token is no longer valid between sending of the email and retrieving the sent
            // email's data
            switch (emailAccount.network) {
              case mailConstants.OUTLOOK:
                mailController.checkTokenValidity(emailAccount, (err, updatedEmailAccount) => {
                  if (err) callback(err);
                  else {
                    outlookController.getSentMail(emailData, updatedEmailAccount, callback);
                  }
                });
                break;
              default:
                
                break;
            }
          })
          .catch(error => {
            if (error.response) {
              //winston.warn(error.response.data);
              callback(error.response.data);
            }
            else {
              //winston.warn(error);
              callback(error);
            }
          })
      }
    })
    // checkEmailAccountValidity(
    //   req.body.emailAccountdata._id,
    //   (err, emailAccount) => {
    //     if (err) {
    //       setInvalidEmailAccount(req.body.emaiAccountdata._id);
    //       callback(new CustomError("Email account error", 530));
    //     } else {
    //       switch (emailAccount.network) {
    //         case mailConstants.GMAIL:
    //           emailObj = { raw: gmailController.buildRfc2822Base64(emailData) };
    //           requestUrl = mailConstants.GOOGLE_BASE_URL + "users/me/messages/send";
    //           break;
    //         case mailConstants.OUTLOOK:
    //           emailObj = outlookController.buildMailBody(emailData);
    //           requestUrl = mailConstants.MICROSOFT_BASE_URL + "sendMail";
    //           break;
    //         default:
    //           callback(new CustomError('Invalid network', 400));
    //           return;
    //       }
      
    //       const authString = 'Bearer ' + emailAccount.emailToken;
    //       axios.post(requestUrl, emailObj, { headers: { Authorization: authString } })
    //         .then(response => {
              
    //           // It is necessary to call the microsoft API after sending the message so the email token must be checked again 
    //           // in case enough time has passed and the token is no longer valid between sending of the email and retrieving the sent
    //           // email's data
    //           switch (emailAccount.network) {
    //             case mailConstants.OUTLOOK:
    //               mailController.checkTokenValidity(emailAccount, (err, updatedEmailAccount) => {
    //                 if (err) callback(err);
    //                 else {
    //                   outlookController.getSentMail(emailData, updatedEmailAccount, callback);
    //                 }
    //               });
    //               break;
    //             default:
    //               // Gmail case
    //               callback(null, { emailData: response.data });
    //               break;
    //           }
    //         })
    //         .catch(error => {
              
    //           if (error.response) {
    //             winston.warn(error.response.data);
    //             callback(error.response.data);
    //           }
    //           else {
    //             winston.warn(error);
    //             callback(error);
    //           }
    //         })
    //     }
    //   }
    // );
    
    
  },

  checkEmailAccountValidity : (accountId, callback) => {
    EmailAccount.findById(accountId, (err, emailAccount) => {
      if (err || !emailAccount)
        callback(err ? err : new CustomError("No email account found"));
      else mailController.checkTokenValidity(emailAccount, callback);
    });
  }
};

module.exports = emailTemplatecontroller;
