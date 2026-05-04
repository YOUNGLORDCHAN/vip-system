const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("YOUR_MONGODB_URI");

const User = mongoose.model("User", {
  email: String,
  password: String,
  vip: Boolean
});

const SECRET = "secretkey123";

// VERIFY PAYMENT + CREATE USER
app.post("/verify-payment", async (req, res) => {
  const { reference, email, password } = req.body;

  try {
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: "Bearer YOUR_SECRET_KEY"
        }
      }
    );

    if (paystackRes.data.data.status === "success") {
      const hashed = await bcrypt.hash(password, 10);

      await User.create({
        email,
        password: hashed,
        vip: true
      });

      return res.send({ success: true });
    }

    res.send({ success: false });
  } catch (err) {
    res.send({ success: false });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send({ success: false });

  const match = await bcrypt.compare(password, user.password);

  if (match && user.vip) {
    const token = jwt.sign({ id: user._id }, SECRET);
    res.send({ success: true, token });
  } else {
    res.send({ success: false });
  }
});

// DASHBOARD PROTECT
app.get("/dashboard", (req, res) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, SECRET);
    res.send({ success: true });
  } catch {
    res.send({ success: false });
  }
});

app.listen(3000, () => console.log("Server running"));
