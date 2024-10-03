const User = require('../../users/models/user');
const stripe = require('stripe')(process.env.STRIPE_KEY);

module.exports = {
  findOrCreateStripeCustomer: (user, source, callback) => {
    if (user.stripeCustomerId) {
      stripe.customers.retrieve(user.stripeCustomerId, callback);
    }
    else {
      stripe.customers.create({
        email: user.email,
        source,
        metadata: {
          pitchDBId: user.userId,
          name: user.name
        }
      }, (err, customer) => {
        if (err) callback(err);
        else {
          User.findByIdAndUpdate(user.userId, { stripeCustomerId: customer.id }, (err) => {
            if (err) callback(err);
            else callback(null, customer);
          })
        }
      });
    }
  },

  findStripeCustomer: (customerId) => {
    return stripe.customers.retrieve(customerId)
  },
  retriveOrCreateStripeCustomer: (user, callback) => {
    if (user.stripe_id) {
      stripe.customers.retrieve(user.stripe_id, callback);
    }
    else {
      stripe.customers.create({
        email: user.email,
        metadata: {
          pitchDBId: user.userid,
          name: user.name
        }
      }, (err, customer) => {
        if (err) callback(err);
        else {
          User.findByIdAndUpdate(user.userid, { stripeCustomerId: customer.id }, (err) => {
            if (err) callback(err);
            else callback(null, customer);
          })
        }
      });
    }
  },
}