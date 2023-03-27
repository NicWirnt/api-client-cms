import express from "express";

import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_LIVE_KEY);
let totalOrder = 0;
const calculateOrderAmount = (items) => {
  //calculate amounts
  items.map((item, i) => {
    totalOrder = totalOrder + item.price * item.cartQty;
  });
  return totalOrder * 100;
};

router.post("/", async (req, res, next) => {
  try {
    const { items } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "aud",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
