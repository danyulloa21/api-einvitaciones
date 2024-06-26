// middleware.js
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../config.js"

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Ingresa tus credenciales' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (error) {
    console.log(error + token)
    return res.status(403).json({ error: 10, message: 'Invalid token' });
  }
};


