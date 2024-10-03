/* eslint-disable linebreak-style */
const User = require('../models/user');
const Credential = require('../models/credential');

const CustomError = require('../../common/errors/custom-error');

const authController = require('./authentication');
const userCredentialsController = require('./user-credential');
const listController = require('../../lists/controllers/list');
const counterController = require('../../credits/controllers/counter');

const networkConstants = require('../../users/constants/networks');

const bcrypt = require('bcryptjs');

const userController = {
  update: (updateData, callback) => {
    User.findByIdAndUpdate(updateData._id, updateData, { new: true }, callback);
  },

  login: (loginInfo, callback) => {
    User.findOne({ email: loginInfo.email }, (err, user) => {
      if (err || !user) callback(err || new CustomError("No account found with that email and/or password", 401))
      else {
        compareUserPasswords(user._id, loginInfo.password, true, (err) => {
          authController.saveLoginData(user && user._id, err);
          if (err) callback(err);
          else if (user.disabled) callback(new CustomError("User is disabled"), 418);
          else {
            const token = authController.generateJWT(user);

            if (user.addedPrivileges && user.addedPrivileges.length > 0) {
              //Do something

            }

            User.findOneAndUpdate({ _id: user._id }, { jwtToken: token, addedPrivileges: [] }, err => {
              if (err) callback(err);
            })
            callback(null, token)
          }
        })
      }
    })
  },

  createFromWebHook: (whData, queryParams, isV2, callback) => {
    let pitches
    let permissions = []

    if (queryParams.pitches) {
      pitches = Number(queryParams.pitches)
    } else {
      pitches = isV2 ? 25 : 5;
    }

    if (queryParams.permission) {
      permissions.push(queryParams.permission)
    } else {
      permissions.push('allAccess')
    }

    console.log(pitches);
    console.log(permissions);

    let userData = {
      ...parsePaperformResponse(whData),
      paperform: true
    }
    userData.signupEmail = userData.email;
    let newUser = new User({ ...userData, privileges: permissions });

    newUser.save((err, user) => {
      if (err) callback(err);
      else {
        listController.createDefaultList(user, (err) => {
          if (err) callback(err)
          else {
            counterController.createCounter(user._id, null, pitches, (err) => {
              if (err) callback(err);
              else {
                userCredentialsController.sendUserPassword(user, true, (err) => {
                  if (err) callback(err);
                  else callback(null, user);
                });
              }
            })
          }
        });
      }
    })
  },

  updateSignInMethod: (req, callback) => {
    let CALLBACK_URL = process.env.FRONT_BASE_URL + "/authcallback";

    let params;
    let method;

    switch (req.params.network) {
      case networkConstants.LINKEDIN:
        params = {
          grant_type: 'authorization_code',
          code: req.body.code,
          redirect_uri: CALLBACK_URL,
          client_id: process.env.LINKEDIN_ID,
          client_secret: process.env.LINKEDIN_SECRET
        }
        method = authController.linkedinLogin;
        break;

      case networkConstants.FACEBOOK:
        params = "code=" + req.body.code;
        params += "&redirect_uri=" + CALLBACK_URL;
        params += "&client_id=" + process.env.FACEBOOK_ID;
        params += "&client_secret=" + process.env.FACEBOOK_SECRET;
        method = authController.facebookLogin;
        break;

      case networkConstants.GOOGLE:
        params = {
          grant_type: 'authorization_code',
          code: req.body.code,
          redirect_uri: CALLBACK_URL,
          client_id: process.env.GOOGLE_ID,
          client_secret: process.env.GOOGLE_SECRET
        }
        method = authController.googleLogin
        break;

      case networkConstants.MICROSOFT:
        params = {
          client_id: process.env.MICROSOFT_ID,
          client_secret: process.env.MICROSOFT_PASSWORD,
          code: req.body.code,
          redirect_uri: CALLBACK_URL,
          grant_type: 'authorization_code'
        };
        method = authController.microsoftLogin
        break;

      default:
        callback("Invalid network");
        break;
    }
    method(params, 'true', null, req.decoded.userId, callback);
  },

  changePassword: (req, callback) => {
    let { password, newPassword } = req.body;
    compareUserPasswords(req.decoded.userId, password, false, (err) => {
      if (err) callback(new CustomError('Your old password is incorrect', 422))
      else {
        const saltRounds = 10;
        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
          if (err) callback(err)
          else {
            Credential.findOneAndUpdate({ userId: req.decoded.userId }, { password: hash }, err => {
              if (err) callback(err);
              else
                callback();
            })
          }
        })
      }
    })
  },

  resetPassword: (req, callback) => {
    User.findOne({ email: req.body.email, network: null }, (err, user) => {
      if (err || !user) callback();
      else {
        userCredentialsController.sendUserPassword(user, false, callback);
      }
    })
  }

};

const parsePaperformResponse = paperformData => {
  // {
  //   data: [
  //     {
  //       title: 'First Name',
  //       description: "What's your first name?",
  //       type: 'text',
  //       key: 'chaa0',
  //       custom_key: null,
  //       value: 'Stephanie'
  //     },
  //     {
  //       title: 'Last Name',
  //       description: "What's your last name?",
  //       type: 'text',
  //       key: '5gbvi',
  //       custom_key: null,
  //       value: 'Roberts'
  //     },
  //     {
  //       title: 'Email Address',
  //       description: 'Which email address would you like to use to log into PitchDB?',
  //       type: 'email',
  //       key: '2pcie',
  //       custom_key: null,
  //       value: 'contactsroberts@gmail.com'
  //     },
  //     {
  //       title: 'Phone Number',
  //       description: 'We use text messages  to provide the best customer support in the world.',
  //       type: 'phone',
  //       key: 'da5rh',
  //       custom_key: null,
  //       value: '2024120703'
  //     },
  //     {
  //       title: 'Hey {{ chaa0 }}, Nice to meet you.  \n' +
  //         '\n' +
  //         'Do you mind if I take 30 seconds to get to know you better?\n' +
  //         '\n' +
  //         'How many times are you looking to be booked on a podcast or to speak each month?',
  //       description: null,
  //       type: 'number',
  //       key: '2abrb',
  //       custom_key: null,
  //       value: '4'
  //     },
  //     {
  //       title: 'Okay... We can help you achieve that.  \n' +
  //         '\n' +
  //         'How do you currently book podcasts & speaking engagements?',
  //       description: null,
  //       type: 'choices',
  //       key: '19lq9',
  //       custom_key: null,
  //       value: [Array]
  //     },
  //     {
  //       title: 'PitchDB has both Free and Paid Accounts.\n' +
  //         '\n' +
  //         'Which type of account are you creating today?',
  //       description: null,
  //       type: 'choices',
  //       key: '3d07r',
  //       custom_key: null,
  //       value: 'FREE - Basic Profile - Producers reach out to you to book you as a guest'
  //     },
  //     {
  //       title: "Great!!! {{ chaa0 }}, we've found that proactively pitching podcasters is the best way to get booked. \n" +
  //         '\n' +
  //         'Would you like a lifetime or monthly  account?',
  //       description: null,
  //       type: 'choices',
  //       key: '70rep',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'You stated earlier that your goal is to get {{ 2abrb }} bookings per month.\n' +
  //         '\n' +
  //         'Which Lifetime Account below that will help you to achieve your goal?',
  //       description: 'Pay One Time and get new pitches to use each month',
  //       type: 'products',
  //       key: '3j5os',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'YOU WILL SAVE $807 in Future Monthly Fees ',
  //       description: 'You will have lifetime access without monthly payments',
  //       type: 'subscriptions',
  //       key: '99i81',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'YOU WILL SAVE $1,149 in Future Monthly Fees',
  //       description: 'You will have lifetime access without monthly payments',
  //       type: 'subscriptions',
  //       key: '22sbh',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'YOU WILL SAVE $2,515 in Future Monthly Fees',
  //       description: 'You will have lifetime access without monthly payments',
  //       type: 'subscriptions',
  //       key: '1nv66',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'YOU WILL SAVE $5,317 in Future Monthly Fees',
  //       description: 'You will have lifetime access without monthly payments',
  //       type: 'subscriptions',
  //       key: '83r12',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: '{{ chaa0 }} , a PitchDB Monthly Account gives you 10 Pitches to use each month.  \n' +
  //         '\n' +
  //         'It is perfect if you only need 1-2 bookings per month',
  //       description: 'You can purchase more pitches in bundles of 25, 50 & 100 if you need them before your account refills monthly.',
  //       type: 'subscriptions',
  //       key: 'dfec2',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'For many of our clients, this is their first time pitching on their own, so we offer help.  \n' +
  //         '\n' +
  //         'Would you like us to help you write your pitches?',
  //       description: null,
  //       type: 'yesNo',
  //       key: 'aiupf',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'Choose the Type of Help You would like?',
  //       description: null,
  //       type: 'products',
  //       key: 'avsvi',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'We are happy to do all of the work for you. Choose a time below to set up the onboarding call to get you all set up.',
  //       description: null,
  //       type: 'appointment',
  //       key: '1gh4',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'What Type Of Media Kit Do You Have?',
  //       description: null,
  //       type: 'choices',
  //       key: '1uocn',
  //       custom_key: null,
  //       value: 'One Sheet'
  //     },
  //     {
  //       title: 'Would You Like Help Creating A Media Kit?',
  //       description: null,
  //       type: 'products',
  //       key: 'blsk',
  //       custom_key: null,
  //       value: null
  //     },
  //     {
  //       title: 'Ok {{ chaa0 }}, Do you have any other questions for me?  \n' +
  //         '\n' +
  //         'If not, click the button below and we will get you all set up.',
  //       description: null,
  //       type: 'text',
  //       key: '9g1gv',
  //       custom_key: null,
  //       value: null
  //     }
  //   ],
  //   form_id: '61eeed057ba3d106e842ebc9',
  //   slug: '3ue0towt',
  //   submission_id: '61f83041f5c12f408834b0cb',
  //   created_at: '2022-01-31 12:53:53',
  //   ip_address: '24.216.69.223',
  //   charge: {
  //     products: [],
  //     summary: '',
  //     discount: 0,
  //     discounted_subscriptions: [],
  //     coupon: false,
  //     total: 0,
  //     tax: 0,
  //     tax_percentage: 0,
  //     processing_fee: 0,
  //     authorize: null,
  //     receipt_email: false
  //   },
  //   device: {
  //     type: 'desktop',
  //     device: 'Macintosh',
  //     platform: 'OS X',
  //     browser: 'Firefox',
  //     embedded: true,
  //     url: 'https://3ue0towt.paperform.co/?embed=1&takeover=0&inline=1&popup=0&_d=pitchdb.com&_in=0',
  //     user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:92.0) Gecko/20100101 Firefox/92.0',
  //     utm_source: null,
  //     utm_medium: null,
  //     utm_campaign: null,
  //     utm_term: null,
  //     utm_content: null,
  //     ip_address: '24.216.69.223'
  //   }
  // }

  let paperformDataObj = paperformData.data;
  let userObj = { detail: {} };

  paperformDataObj.forEach(question => {
    if (typeof question.value === 'string')
      question.value = question.value.trim();
    userObj.detail[question.custom_key] = question.value
  });

  const emailQuestion = paperformDataObj.find(q => q.title === 'Email Address');
  const firstNameQuestion = paperformDataObj.find(q => q.title === 'First Name');
  const lastNameQuestion = paperformDataObj.find(q => q.title === 'Last Name');

  userObj.submissionId = paperformData.submission_id;
  userObj.email = emailQuestion.value;
  userObj.name = firstNameQuestion.value + " " + lastNameQuestion.value;

  return userObj;
}

const compareUserPasswords = (userId, password, updateAttempt, callback) => {
  Credential.findOne({ userId }, (err, credential) => {
    if (err || !credential) callback(err || new CustomError("No account found with that email and/or password", 401));
    else {
      bcrypt.compare(password, credential.password, (err, res) => {
        if (err || !res) callback(err || new CustomError("No account found with that email and/or password", 401))
        else callback();
      });
    }
  })
}

module.exports = userController;