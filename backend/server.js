const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

// register
app.post("/register", (req, res) => {
  users.push(req.body);
  res.json({ message: "User registered" });
});

// login
app.post("/login", (req, res) => {
  const user = users.find(
    u => u.email === req.body.email && u.password === req.body.password
  );

  if (user) {
    res.json({ success: true, vip: false });
  } else {
    res.json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Backend running");
});
