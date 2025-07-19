const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_SECRET",
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: "order_rcptid_11",
    });

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

module.exports = router;
