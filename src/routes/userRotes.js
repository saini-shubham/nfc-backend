const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
//createUser
router.post("/createUser", verifyToken, async (req, res) => {
  const { userId, userType } = req.user;
  if (userType === "admin" || userType === "superAdmin") {
    const { name, adhaarNumber, firmName, city, phoneNumber, userType } =
      req.body;

    // Generate the ID based on the name, Aadhaar number, and firm name
    const generatedId =
      //parseInt(Buffer.from(name + adhaarNumber + firmName).toString("hex"), 16)
      // Date.now().toString(36) + Math.random().toString(36).substr(2)+"."+firmName
      phoneNumber + "." + firmName; // Generate a random password

    console.log(generatedId);
    const generatedPassword = Math.random().toString(36).slice(-6);
    //console.log(generatedPassword);

    try {
      // Hash the password
      //onst hashedPassword = await bcrypt.hash(generatedPassword, 10); // Create a new instance of the User model with the provided data and generated ID and password
      // let{token} = req.headers;
      // token =jwt.verify(token,config.secret);
      const user = new User({
        name,
        adhaarNumber,
        firmName,
        city,
        phoneNumber,
        userType,
        userId: generatedId,
        password: generatedPassword,
      }); // Save the user to the database
      await user.save();
      res.status(201).json({
        message: "User saved successfully",
        userId: generatedId,
        password: generatedPassword,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).send(error.message);
    }
  } else {
    return res.status(403).send("Not Authorized to create user");
  }
});

// authenticate and generate JWT token
router.post("/login", (req, res) => {
  const { userId, password } = req.body; // Find the user in the User table by userId and password
  User.findOne({ userId, password })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      } // Generate a JWT token with the user's ID
      const userType = user.userType;
      const token = jwt.sign(
        { userId: user.userId, userType: user.userType },
        config.secret
      );
      res.status(200).json({ token, userId, userType });
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      res
        .status(500)
        .json({ message: "An error occurred while authenticating the user" });
    });
});

//to get all the users
router.get("/users", verifyToken, async (req, res) => {
  const { userId, userType } = req.user;
  try {
    if (userType === "admin" || userType === "superAdmin") {
      const users = await User.find();
      res.json(users);
    } else {
      res.status(403).send("Unautorized");
    }

    //client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//to delete a user
// DELETE request to delete a user by ID
router.delete("/users/:id", verifyToken, async (req, res) => {
  const { userId, userType } = req.user;
  try {
    if (userType === "admin" || userType === "superAdmin") {
      const result = await User.deleteOne({ userId: req.params.id });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json({ message: "User deleted successfully" });
      }
    } else res.status(403).send("Unautorized");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Token verification middleware
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    } // Add the decoded token payload to the request object

    req.user = decoded;
    next();
  });
}
module.exports = router;
