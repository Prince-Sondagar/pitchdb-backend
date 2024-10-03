const axios = require('axios');
const EmailAccount = require('../../users/models/email-account');
const CustomError = require('../../common/errors/custom-error');
const querystring = require('querystring');
const winston = require('winston');
const mailConstants = require('../constants/mail');
const gmailController = require('./gmail');
const outlookController = require('./outlook');

const mailController = {
  checkTokenValidity: (emailAccount, callback) => {
   let now = new Date();
    //let dif = emailAccount.tokenExpiration.getTime() - now.getTime();
   let dif = emailAccount.tokenExpiration - now.getTime();
   let seconds = dif / 1000;
  
   
    if (seconds < 30) {
      
      let params = {
        grant_type: 'refresh_token',
        refresh_token: emailAccount.emailRefreshToken,
      }
      let oauthEndpoint;

      switch (emailAccount.network) {
        
        case mailConstants.GMAIL:
          params.client_id = process.env.GOOGLE_ID;
          params.client_secret = process.env.GOOGLE_SECRET;
          oauthEndpoint = mailConstants.GOOGLE_TOKEN_URL;
          break;
        case mailConstants.OUTLOOK:
          params.client_id = process.env.MICROSOFT_ID;
          params.client_secret = process.env.MICROSOFT_PASSWORD
          oauthEndpoint = mailConstants.MICROSOFT_TOKEN_URL;
          break;
        default:
          callback(new CustomError('Invalid network', 400));
          break;
      }
      
      if (oauthEndpoint) {
        axios.post(oauthEndpoint, querystring.stringify(params))
          .then(response => {
            let expDate = new Date();
            expDate.setSeconds(expDate.getSeconds() + response.data.expires_in);
            const authObject = {
              emailToken: response.data.access_token,
              tokenExpiration: expDate
            }
            EmailAccount.findByIdAndUpdate(emailAccount._id, { ...authObject }, { new: true }, (err, foundEmailAccount) => {
              if (err) callback(err);
              callback(null, foundEmailAccount);
            })
          })
          .catch(error => {
            winston.warn(error.response.data);
            callback(error.response.data);
          })
      }
    }
    else
      callback(null, emailAccount);
        //  console.data(start)
        // email_acc_oo1 {
        //   _id: 60361379dd6052045833faca,
        //   email: 'pateanil82@hotmail.com',
        //   network: 'outlook',
        //   userId: 5e6f153ae53331525c0aade2,
        //   emailToken: 'EwBoA8l6BAAUwihrrCrmQ4wuIJX5mbj7rQla6TUAAaAI+hy1tw/aczUk9Gebl1258fVQ0n1h0eHC/jIfutyYSF5cRaHouXS+SlJ7KrvirnstAXvruZLJpnd1fR965Wmjjfj2YZLhFIPd4EdIZpebQFrsJX9R2QnMg51snmsJu1nZJ+1sDyWqwhLXsjuRqfo/T1kV9n611s6S875ho/iWndajzvA0jOfVIiPIScbtcJ25YTWAPlZ6x+eaAPpVtf8VMseWLDS2VzkcTC9Rywu63z2/nmI3RMr55YMWorcvy/BbPAQAoLSCADXmVxjEpcmlRov7yktS2OMYE+woEqXC5QmEoMF+dLFG+YomH3qiMgaJDU34lzuXATTy577QkTUDZgAACK6HE9CLWKelOAIGiEWv4E8lkR5Jy38Qbq5XCfoes/ZLyA5ZCBV8e67L3TLoFQlA6dKx67ljR+Fvs0bUcy4kbHSzxYEsWj4abDw8Zy5iTWVlwMblaUCTVcmDN+FeY/TSDP7ocyOt1YeY2nb7Up4dX/FhiVsFjBDnP1L0Ea7UaDiDbg/ZE3x5fgutyRsCMNSBoul8sXt+Lws0D6jPuH4DI+fZ2KhNtTJ7HxWaTQQNwUKDIEQVabByaOh0+YJH2uVCot3YBHbvbExFcAOavnY6vkv4xbsG/EtEdL28pmkA5RWSVp0lbPNl3RvU+pudgPrC2+0DQ1eNYcJDb827iyHBOuC+ZCqqWtJJTjuU37GT2LXvtp/nQ1loASvQRXJ6fZL1anqwIkCTYNqXeQk4YvPXo0UAt6RFFu2nmQ8VF/oEsMGhZYzfAFW37HuJza8WXMibK68Qz2TD35PLFcXOmmM0u7d6d2WuXxNDOYdCDlUjjTWwL+1K2fyVnz+R0LbFntx6h4vNGx5z3dc+HlXtWi+aoCv3QxRa2FgGUeVUO/HBj6jIfuMk+4h4I7qHIxcdK3fXEfLM5d1hAilbblzcyw7UdscT+TEKeT7ocXMjUf24FQbSuVMWG843TAInOJzLfdfnYjeEGB1lENakdanOPskAfODCFqsLdybpS8DyisoCKkdWlQbzR7mjf+Wdv1gY8b621yFQEpkAlSsDwV/33tafSmcqmXPdy9wbEAta4C29nGQnsT+rU3OjrQt0nX4vyMrSOYyedgI=',
        //   emailRefreshToken: 'M.R3_BAY.CX8BtFBkJcHFOfVORN4e0zr7eWS6tFfSxnjwiNcVQlqjxugViJA68W5nY9ofDJL65sdf0eRov!gqGOqLpSPwckjp7fLfLPbxv9vtFgsLx8EMH8wNszcY6mIHm5WZDobeRkYCcNzgEFt!kjjngdw9H0AMZ2L1F8vAxbLDipSoI1kpmGwsfUZs8m!2qhfwDQvequGN8uJjH!lfWIuwsQ!xgQQCLpwd6pbOyRug98fSonEO8MmufGO4xmwN1KrZ3IDb9IuBErIPM94GhKp2K!9IG4QDR1fZzI*qz6Z913CuJNmO1KjvFKYqDAZrVCV6gcLzfddEpsbKp35Gz!YIUlh*g74U!Aynqj4tnT7i0xbYDGfPfqGWbpE!SIhV3cZF5!eMsY3zCVGxry8z2kqLq8ijhkLioNt3iXYtGcuYCIVULP124ErHaNtAi9t27AAd!hguivrWwt9tF9zh8*!flfkAOS!855CIYWdo4Dt0VccUrpRCrr!s*MblvIPip6xU84aN5gc2zWCKSS!woNnWyoA4MISOZWvqQJeXrnMq8rw3qOfR2xGEwOks3QwCmzqLtUElpQ$$',
        //   tokenExpiration: 2021-09-30T08:21:10.104Z,
        //   date: 2021-02-24T08:59:20.936Z,
        //   activationDate: 2021-02-24T11:21:15.877Z,
        //   __v: 0,
        //   invalid: true
        // }
        // consoledata(end)


  },

  sendEmail: (emailData, emailAccount, callback) => {
    let emailObj;
    let requestUrl;    
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
            // Gmail case
            callback(null, { emailData: response.data });
            break;
        }
      })
      .catch(error => {
        
        if (error.response) {
          winston.warn(error.response.data);
          callback(error.response.data);
        }
        else {
          winston.warn(error);
          callback(error);
        }
      })
  },

  getEmailConversation: (content, { network, emailToken }, callback) => {
    switch (network) {
      case mailConstants.GMAIL:
        gmailController.getConversation(content, emailToken, callback);
        break;
      case mailConstants.OUTLOOK:
        outlookController.getConversation(content, emailToken, callback);
        break;
      default:
        callback(new CustomError('Invalid network', 500));
        break;
    }
  }
};

module.exports = mailController;