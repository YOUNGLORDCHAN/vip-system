const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is working");
});

// REGISTER
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  users.push({ email, password });

  console.log("Users:", users);

  res.json({ success: true, message: "Registered" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
