import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

// Controller actions
export const getUserInfo = (req, res) => {
  // Logic to get user info
  console.log("Get user info");
  let valores = [];
  let filtros = "1 = 1";
  // console.log(req);
  for (const param in req.query) {
    if (req.query.hasOwnProperty(param)) {
      const paramName = param === "id" ? "user_id" : param;
      const paramValue = req.query[param];
      filtros += ` AND ${paramName} LIKE '%${paramValue}%'`;
      valores.push(paramValue);
    }
  }
  
  let query = `SELECT * FROM user_info WHERE ${filtros}`;
  console.log(query)
  

  console.log(`Query: ${query}`);
  console.log(`valores: ${valores}`);
  console.log(`filtros: ${filtros}`);
  // return;
  pool
    .query(query, valores)
    .then(([results]) => {
      res.json({ error: 0, message: "User info retrieved successfully", data: results });
    })
    .catch((error) => {
      res.status(500).json({ error: 1, message: "Error retrieving user info" });
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
  // console.log(accessToken);
  // res.json({token: accessToken})
  // return;
  const { full_name, phone } = req.body;

  try {
    // Decode the access token to get the user_id
    const decodedToken = jwt.verify(accessToken, JWT_SECRET);
    const user_id = decodedToken.id;
    // console.log(decodedToken)

    let columnas = "?, ";
    let columnasNombre = "user_id, ";
    let valores = [];
    valores.push(user_id);
    let coma = "";
    for (const property in req.body) {
      console.log(`${property}: ${req.body[property]}`);
      columnas += `${coma}?`;
      columnasNombre += `${coma}${property}`;
      valores.push(req.body[property]);
      coma = ', ';
    }

    let query = `INSERT INTO user_info (${columnasNombre}) VALUES (${columnas})`

    console.log(`columnas: ${columnas}`)
    console.log(`valores: ${valores}`)
    console.log(`query: ${query}`)
    
    

    pool.query(query, valores)
      .then(([results]) => {
        if (results.affectedRows != 0) {
          res.json({ error: 0, message: "User info created successfully", data: results});
        } else {
          throw new Error("Error creating user info");
        }
          }).catch((error) => {
        res.status(500).json({ error: 1, message: "Error creating user info" });
        console.error(error); // Log the actual error
      });
    } catch (error) {
    res.status(401).json({ error: 1, message: "Invalid token" });
    console.error(error); // Log the actual error
  }
};

export const updateUserInfo = (req, res) => {
  console.log("Update user info");

  const info_id = req.query.id; // Access user_id from URL params
  const { full_name, phone } = req.body; // Destructure full_name and phone from the request body
  console.log(`body` + req.body);

  let columnas = "";
  let valores = [];
  let valoresNombre = [];
  let coma = "";
  // Recorrer el objeto req.body
  for (const property in req.body) {
    console.log(`${property}: ${req.body[property]}`);
    columnas += `${coma}${property} = ? `;
    valores.push(req.body[property]);
    valoresNombre.push(property);
    coma = ", ";
  }
  console.log(`columnas ${columnas}`);
  console.log(`valores ${valores}`);
  // if (!full_name && !phone) {
  //     return res.status(400).json({ error: 1, message: "Full name or phone is required" });
  // }

  if (valores.length == 0) {
    console.log("No hay valores");
    return res
      .status(400)
      .json({ error: 1, message: "Full name or phone is required" });
  }

  valores.push(info_id);
  console.log(`valores ${valores}`);
  let defaultQuery = `UPDATE user_info SET ${columnas} WHERE id = ?`;

  // if (full_name && !phone) {
  //     defaultQuery = "UPDATE user_info SET full_name = ? WHERE id = ?";

  pool
    .query(defaultQuery, valores)
    .then((results) => {
      console.log(`Actualizando ${valoresNombre.map((val) => `${val}`)}`);
      res.json({
        error: 0,
        message: "User info updated successfully",
        data: results,
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: 1, message: "Error updating user info (full_name)" });
      console.error(error); // Log the actual error
    });
  
  // }

  // if (phone && !full_name) {

  //     defaultQuery = "UPDATE user_info SET phone = ? WHERE id = ?";

  //     pool.query(defaultQuery, [phone, info_id])
  //     .then((results) => {
  //         console.log('Actualizando telefono')
  //       res.json({ error: 0, message: "User info updated successfully", data: results });
  //     }).catch((error) => {
  //         res.status(500).json({ error: 1, message: "Error updating user info (phone)" });
  //         console.error(error); // Log the actual error
  //     });
  //     return;
  // }
};

export const deleteUserInfo = (req, res) => {
  // Logic to delete user info
  console.log("Delete user info");

  const info_id = req.query.id; // Access user_id from URL params
  console.log(info_id);
  pool
    .query("DELETE FROM user_info WHERE id = ?", [info_id])
    .then(([results]) => {
      if (results.affectedRows != 0) {
        return res.json({
          error: 0,
          message: "User info deleted successfully",
        });
      } else {
        return res
          .status(404)
          .json({ error: 1, message: "User info not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 1, message: "Error deleting user info" });
      console.error(error); // Log the actual error
    });
};
