import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

// Controller actions
export const getUserInfo = (req, res) => {
  // Logic to get user info
  console.log("Get user info");

  const user_id = req.params.id;
  console.log(req.params);

  pool
    .query("SELECT * FROM user_info where user_id = ?", [user_id])
    .then(([results]) => {
      if (results.length == 0) {
        console.log("User info not found");
        return res
          .status(404)
          .json({ error: 1, message: "User info not found" });
      }
      console.log("Showing user info");
      console.log(results);
      res.json({ error: 0, data: results }); // Send results on success
    })
    .catch((error) => {
      res.status(500).json({ error: 1, message: "Error getting user info" });
      console.error(error); // Log the actual error
    });
};

export const createUserInfo = (req, res) => {
  // Logic to create user info
  console.log("Create user info");

  // Accediendo al token desde el encabezado 'Authorization'
  const token = req.headers.authorization;

  // Si el token viene con el prefijo 'Bearer ', necesitas removerlo para obtener solo el token
  const accessToken = token && token.startsWith("Bearer ") ? token.slice(7) : token;
  console.log(accessToken);
  // res.json({token: accessToken})
  // return;
  const { full_name, phone } = req.body;

  try {
    // Decode the access token to get the user_id
    const decodedToken = jwt.verify(accessToken, JWT_SECRET);
    const user_id = decodedToken.id;
    // console.log(decodedToken)

    pool
      .query(
        "INSERT INTO user_info (user_id, full_name, phone) VALUES (?, ?, ?)",
        [user_id, full_name, phone]
      )
      .then((results) => {
        res.json({
          error: 0,
          message: "User info created successfully",
          data: results,
        });
      })
      .catch((error) => {
        res.status(500).json({ error: 1, message: "Error creating user info" });
        console.error(error); // Log the actual error
      });
  } catch (error) {
    res.status(401).json({ error: 1, message: "Invalid access token" });
    console.error(error);
  }
};

export const updateUserInfo = (req, res) => {
    console.log("Update user info");
  
    const info_id = req.params.id; // Access user_id from URL params
    const { full_name, phone } = req.body; // Destructure full_name and phone from the request body
    
    if (!full_name && !phone) {
        return res.status(400).json({ error: 1, message: "Full name or phone is required" });
    }

    let defaultQuery = "UPDATE user_info SET full_name = ?, phone = ? WHERE id = ?";
    
    if (full_name && !phone) {
        defaultQuery = "UPDATE user_info SET full_name = ? WHERE id = ?";

        pool.query(defaultQuery, [full_name, info_id])
        .then((results) => {
            console.log('Actualizando nombre')
          res.json({ error: 0, message: "User info updated successfully", data: results });
        }).catch((error) => {
            res.status(500).json({ error: 1, message: "Error updating user info (full_name)" });
            console.error(error); // Log the actual error
        });
        return;
    }

    if (phone && !full_name) {
        
        defaultQuery = "UPDATE user_info SET phone = ? WHERE id = ?";
        
        pool.query(defaultQuery, [phone, info_id])
        .then((results) => {
            console.log('Actualizando telefono')
          res.json({ error: 0, message: "User info updated successfully", data: results });
        }).catch((error) => {
            res.status(500).json({ error: 1, message: "Error updating user info (phone)" });
            console.error(error); // Log the actual error
        });
        return;
    }
    

    pool.query(defaultQuery, [full_name, phone, info_id])
      .then(([results]) => {
        if (results.affectedRows != 0) {
            console.log('Actualizando nombre y telefono')
            return res.json({ error: 0, message: "User info updated successfully", data: results });
        } else {
            return res.status(404).json({ error: 1, message: "User info not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 1, message: "Error updating user info" });
        console.error(error); // Log the actual error
      });
  };

export const deleteUserInfo = (req, res) => {
  // Logic to delete user info
  console.log("Delete user info");

    const info_id = req.params.id; // Access user_id from URL params

    pool.query("DELETE FROM user_info WHERE id = ?", [info_id])
      .then(([results]) => {
        if (results.affectedRows != 0) {
          return res.json({ error: 0, message: "User info deleted successfully" });
        } else {
          return res.status(404).json({ error: 1, message: "User info not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 1, message: "Error deleting user info" });
        console.error(error); // Log the actual error
      });
};
