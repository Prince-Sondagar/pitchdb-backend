const Subscription = require('../models/subscription');
const User = require('../../users/models/user');
const subscriptionController = require('../controllers/subscription');
const userAdminController = require('../../users/controllers/admin-user')
const CustomError = require('../../common/errors/custom-error');

const stripeCommon = require('../../util/controllers/stripe-common');

const webhookController = {
  handleInvoiceUpcoming: (req, callback) => {
    callback();
  },

  handleInvoicePaymentSucceeded: (req, callback) => {
    const invoiceData = req.body.data.object;
    const lineItem = invoiceData.lines.data[0];

    let renewalDate = new Date(lineItem.period.start * 1000);
    let expDate = new Date(lineItem.period.end * 1000);
    expDate.setDate(expDate.getDate() + 1);
    Subscription.findOneAndUpdate({ stripeSubId: invoiceData.subscription }, {
      lastRenewWal: renewalDate,
      dateEnd: expDate,
      status: 'active'
    }, (err, subscription) => {
      if (err)
        callback(err);
      else {
        if (!subscription) {
          handleUnexistingSub(invoiceData, (err) => {
            if (err) callback(new CustomError("Subscription not found or could not be created"));
            else webhookController.handleInvoicePaymentSucceeded(req, callback);
          })
        }
        else {
          const updateObject = {}
          if (lineItem.plan && lineItem.plan.metadata.app_access) {
            updateObject.privileges = lineItem.plan.metadata.app_access.split(',')
          }
          User.findByIdAndUpdate(subscription.userId, updateObject, (err, user) => {
            if (err) callback(err)
            else {
              if (subscription.credits !== Number.POSITIVE_INFINITY) {
                subscriptionController.addSubscriptionCredits(user, subscription, (err) => {
                  if (err) callback(err)
                  else callback(null, subscription);
                })
              } else callback(null, subscription);
            }
          })
        }
      }
    })
  },

  handleCustomerSubscriptionUpdated: (req, callback) => {

    const subscriptionData = req.body.data.object;
    const newStatus = subscriptionData.status;
    if (newStatus === 'canceled' || newStatus === 'unpaid') {
      handleCanceledOrUnpaid(subscriptionData, callback)
    }
    else {
      callback();
    }
  },
}

const handleCanceledOrUnpaid = (subscription, callback) => {
  Subscription.findOneAndUpdate({ stripeSubId: subscription.id }, {
    status: subscription.status,
    credits: 0
  }, (err, updatedSubscription) => {
    if (err)
      callback(err);
    else {
      if (!updatedSubscription)
        callback(new CustomError("Subscription not found"));
      else {
        User.findById(subscription.userId, (err, user) => {
          if (err) callback(err)
          else {
            subscriptionController.removeSubscriptionCredits(user, subscription, (err) => {
              if (err) callback(err)
              else callback(null, updatedSubscription);
            })
          }
        })
      }
    }
  })
}

module.exports = webhookController;

const handleUnexistingSub = (invoiceData, callback) => {

  // let subscription = new Schema({
  //   userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  //   type: { type: String, default: 'free' },

  //   // Possible status are 'active', 'canceled' or 'unpaid'
  //   status: { type: String, required: true },
  //   dateStart: { type: Date, required: true },
  //   lastRenewWal: { type: Date, required: true },
  //   dateEnd: { type: Date, required: true },
  //   stripeSubId: { type: String, required: true },
  //   credits: { type: Number, required: false },
  //   planId: { type: String, required: false },
  //   scheduledToCancel: { type: Boolean, default: false }
  // });
  let renewalDate
  let expDate
  let lineItem
  let nCredits

  stripeCommon.findStripeCustomer(invoiceData.customer)
    .then(customerData => {
      // Find out original user id
      lineItem = invoiceData.lines.data[0]
      renewalDate = new Date(lineItem.period.start * 1000);
      expDate = new Date(lineItem.period.end * 1000);
      nCredits = lineItem.plan.metadata.add_credits || lineItem.plan.metadata.app_credits
      if (nCredits === 'unlimited') {
        nCredits = Number.POSITIVE_INFINITY
      }

      // Create user if doesn't exist
      return handleUnexistingUser(customerData)
    })
    .then((userId) => {
      const newSubscriptionData = {
        userId,
        type: lineItem.plan.nickname,

        // Possible status are 'active', 'canceled' or 'unpaid'
        status: 'active',
        dateStart: renewalDate,
        lastRenewWal: renewalDate,
        dateEnd: expDate,
        stripeSubId: lineItem.subscription,
        credits: isNaN(nCredits) ? 0 : Number(nCredits),
        planId: lineItem.plan.id
      }

      const newSubscription = new Subscription(newSubscriptionData)
      return newSubscription.save()
    })
    .then(() => {
      callback()
    })
    .catch(err => {
      callback(err)
    })
}

const handleUnexistingUser = (customer) => new Promise((resolve, reject) => {
  if (customer.metadata.pitchDBId) return resolve(customer.metadata.pitchDBId);
  userAdminController.createUser({
    name: customer.name,
    email: customer.email
  }, (err, user) => {
    if (err) return reject(err);
    return resolve(user._id)
  })
})
