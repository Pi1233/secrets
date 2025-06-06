const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
var app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const jwt = require("jsonwebtoken");
const secretKey = "superSecretKey123";

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // or your frontend domain
    credentials: true,
  })
);

mongoose.connect(
  "mongodb+srv://saurabhmahajanq:OCy203XCkwIDyLM8@todolist.blq6qnx.mongodb.net/?retryWrites=true&w=majority&appName=todolist"
);

const trySchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const secret = "thisisthemongooseencryptionkey";
trySchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const item = mongoose.model("second", trySchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/signup", function (req, res) {
  const newUser = new item({
    name: req.body.sname,
    email: req.body.sinput,
    password: req.body.spass,
  });

  newUser.save();

  res.redirect("login");
});

app.post("/login", async function (req, res) {
  const username = req.body.loginput;
  const password = req.body.logpass;

  const foundUser = await item.findOne({
    email: username,
  });

  if (foundUser.password === password) {
    const token = jwt.sign(
      {
        userId: foundUser._id,
        username: foundUser.name,
        email: foundUser.email,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    res.redirect("secrets");
  } else {
    res.redirect("login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", authenticateToken, (req, res) => {
  res.render("secrets", {
    userid: req.user.userId.toString(),
    email: req.user.email,
    name: req.user.username,
  });
});

app.get("/userinfo", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "superSecretKey123");
    res.json({
      id: decoded.userId,
      name: decoded.username,
      email: decoded.email,
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
});

app.listen(3000, () => {
  console.log("server running");
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, secretKey, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = userData; // e.g., { userId: 123, role: 'admin' }
    next(); // Go to the next middleware or route handler
  });
}
