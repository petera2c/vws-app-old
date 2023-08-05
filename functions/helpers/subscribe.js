//const admin = require("firebase-admin");

//const { stripeSecretKey, stripePlanID } = require("../config/keys");
//const stripe = require("stripe")(stripeSecretKey);

const subscribeToPlan = async () => {
  //req, res
  /*const { email, payment_method } = req.body;

  // Get user using email
  admin
    .auth()
    .getUserByEmail(email)
    .then(async (user) => {
      // Get user subscription from firestore
      const stripeDoc = await admin
        .firestore()
        .collection("user_subscription")
        .doc(user.uid)
        .get();

      // Check if user has subscription
      if (stripeDoc.exists && stripeDoc.data().stripe_subscription_id) {
        const currentSubscription = await stripe.subscriptions.retrieve(
          stripeDoc.data().stripe_subscription_id
        );

        // Check if subscription is active
        if (currentSubscription.status === "active")
          return res.send({
            message: "You are already subscribed!",
            success: false,
          });

        // If subscription is not active then just continue
      }

      let customer;
      // Subscription is not active so we need to
      // Check to update or create new customer
      if (stripeDoc.exists && stripeDoc.data().stripe_customer_id) {
        // If we are updating customer
        // We first have to attach their new payment
        await stripe.paymentMethods.attach(payment_method, {
          customer: stripeDoc.data().stripe_customer_id,
        });

        // Next update customer default_payment_method
        customer = await stripe.customers.update(
          stripeDoc.data().stripe_customer_id,
          {
            invoice_settings: {
              default_payment_method: payment_method,
            },
            name: user.uid,
          }
        );
      }
      // Create new customer
      else
        customer = await stripe.customers.create({
          invoice_settings: {
            default_payment_method: payment_method,
          },
          name: user.uid,
          payment_method: payment_method,
        });

      // We hopefully have a customer object and can
      // Now create a new subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: stripePlanID }],
      });

      // Now store to firestore
      if (customer.id && subscription.id) {
        await admin
          .firestore()
          .collection("user_subscription")
          .doc(user.uid)
          .set({
            stripe_customer_id: customer.id,
            stripe_subscription_id: subscription.id,
          });

        // Send sweet success
        res.send({ success: true });
      } else
        res.send({
          message:
            "An unknown error occurred. If this continues please message an admin.",
          success: false,
        });
    })
    .catch(() => {
      res.send({
        message: "Can not find your account :(",
        success: false,
      });
    });*/
};

module.exports = { subscribeToPlan };
