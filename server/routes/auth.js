const database = require("../database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();
const SECRET = process.env.SECRET;

async function getUser(email) {
  const [rows] = await database.execute(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase().trim()],
  );
  return rows[0];
}

async function createUser(firstName, lastName, email, passwordHash) {
  return await database.execute(
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email.toLowerCase().trim(), passwordHash],
  );
}

router.post("/sign-up", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await getUser(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await createUser(firstName, lastName, email, passwordHash);
    res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/log-in", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await getUser(email);
    if (!existingUser) {
      return res.status(401).json({ message: "User could not be found." });
    }
    const doesPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!doesPasswordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({ token, message: "User logged in successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
