import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import bcrypt from "bcryptjs";
import { pool } from "../db.js"; // Import the pool object from db.js

// Login logic
export const login = async (req, res) => {
  // console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Query the database for the user
    const user = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length == 0) {
      return res.status(404).send("User not found");
    }

    // Extract the user object from the array
    const realUser = user[0][0];

    // Compare password using bcrypt
    const passwordIsValid = bcrypt.compareSync(password, realUser.password);

    if (!passwordIsValid) {
      return res.status(401).json({ error: 2, message: "Password is invalid" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: realUser.id }, JWT_SECRET, {
      expiresIn: "5m",
    });
    res.json({ error: 0, token });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: 1, message: "Error al hacer login, verifica tu correo" });
  }
};
