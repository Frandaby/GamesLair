//Archivo para todo lo relacionado con autenticación, contraseñas, token, y encriptación
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
const SECRET = process.env.SECRET;
import { getUser, createUser } from "../controllers/authControllers.js";

//Endpoint para signup, con encriptación
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
    //Para comparar password con repeat password
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
    res.status(200).json({
      user: { id: existingUser.id, email: existingUser.email },
      token,
      message: "User logged in successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
