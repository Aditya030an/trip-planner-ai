const express = require("express");
const cors = require("cors");
require('dotenv').config();
require("./db/config");
const User = require("./db/User");
const TripData = require("./db/TripData");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  if (result) {
    res.send(result);
  }
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "No user found" });
    }
  }
});

app.get("/register/:key", async (req, res) => {
  let result = await User.find({
    email: req.params.key,
  });
  if (result.length > 0) {
    res.send(result);
  } else {
    res.send({ result: "No user found" });
  }
});

app.post("/tripdata", async (req, res) => {
  let data = new TripData(req.body);
  console.log("in backend req", req.body);
  let result = await data.save();
  res.send(result);
  console.log("in backend", result);
});

app.get("/view-trip/:id", async (req, res) => {
  let result = await TripData.findOne({ docID: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No found trip" });
  }
});

app.get("/my-trip/:key", async (req, res) => {
  let result = await TripData.find({ userEmail: req.params.key });
  res.send(result);
});

app.listen(5000);
