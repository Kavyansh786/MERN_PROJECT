const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();

// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demo",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "demo_secret",
});

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid amount provided"
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: currency,
      receipt: receipt || `order_rcptid_${Date.now()}`,
      notes: {
        "source": "jewelry_store"
      }
    });

    res.status(200).json({ 
      success: true, 
      order,
      key_id: razorpay.key_id 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Order creation failed"
    });
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Payment verification failed" 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Payment verification failed"
    });
  }
});



module.exports = router;
