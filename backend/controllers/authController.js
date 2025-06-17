import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/db.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  try {
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(name, password, email, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role",
      [username, hashedPassword, email, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    if (role === 'user') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS booking_history_user_${user.id} (
          id SERIAL PRIMARY KEY,
          movie_title TEXT,
          booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          seat_number TEXT,
          amount_paid NUMERIC
        )
      `);
    } else if (role === 'admin') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS theaters_admin_${user.id} (
          id SERIAL PRIMARY KEY,
          theater_name TEXT,
          location TEXT,
          movie_title TEXT,
          show_time TIMESTAMP,
          available_seats INTEGER,
          price NUMERIC
        )
      `);
    }

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
