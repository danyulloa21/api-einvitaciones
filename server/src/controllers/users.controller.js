import { pool } from "../db.js";
import bcrypt from "bcryptjs";

export const getUsers = (req, res) => {
  console.log("GET Users");

  pool
    .query("SELECT * FROM users")
    .then((results) => {
      console.log("Mostrando usuarios");
      res.json(results); // Send results on success
    })
    .catch((error) => {
      res.status(500).json({ error: 1, message: "Error al obtener usuarios" });
      console.error(error); // Log the actual error
    });
};

export const createUser = async (req, res) => {
  const saltRounds = 10;

  console.log("POST User");

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 1, message: "All fields are required" });
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const [results] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );

    console.log(`User created with ID: ${results.insertId}`);
    res.status(201).json({ id: results.insertId, message: "Usuario creado" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      // Example specific error handling
      return res
        .status(409)
        .json({ error: 1, message: "Email already exists" });
    }
    console.error("Error creating user:", err);
    res.status(500).json({ error: 1, message: "Error al crear usuario" });
  }
};
