// controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config.js';
import bcrypt from 'bcryptjs';

// Simulated database
const users = [
  {
    id: 1,
    username: 'demo01',
    password: bcrypt.hashSync('demo01', 8) // replace 'password' with the actual password
  },
  // add more users as needed
];

// Login logic
export const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate username and password against simulated database
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(404).send('User not found');
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send('Password is not valid');
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1m' });
  res.json({ token });
}
