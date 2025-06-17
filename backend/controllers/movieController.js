import { pool } from '../db/db.js';
import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();



export const createMovie = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const { id: admin_id } = jwt.verify(token, process.env.JWT_SECRET);

    const show_time = Array.isArray(req.body.show_time) ? req.body.show_time : [];
    const release_date = req.body.release_date ? req.body.release_date : null;

    const {
      title, description, poster_url, price, seats,
      duration, genre, language, rating, trailer_url, theater_name
    } = req.body;

    const result = await pool.query(
      `INSERT INTO movies
        (title, description, poster_url, release_date, show_time, price, seats, created_by, duration, genre, language, rating, trailer_url, theater_name)
      VALUES
        ($1, $2, $3, $4, $5::TIME[], $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        title, description, poster_url, release_date, show_time, price, seats,
        admin_id, duration, genre, language, rating, trailer_url, theater_name
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding movie:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get movie by ID
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMovieAdmin = async (req, res) =>{
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE created_by = $1', [id]);

    if (result.rows.length === 0) {
      return res.json([]); // return empty array instead of 404
    }

    res.json(result.rows); // return all rows as array
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const { id: admin_id } = jwt.verify(token, process.env.JWT_SECRET);

    const {
      title, description, poster_url, release_date, show_time,
      price, seats, duration, genre, language, rating,
      trailer_url, theater_name
    } = req.body;

    // Sanitize / format fields:

    const formattedShowTime = Array.isArray(show_time)
      ? `{${show_time.map(t => `"${t}"`).join(",")}}`
      : '{}';

    const formattedReleaseDate = release_date ? release_date : null;

    const formattedPrice = price ? parseFloat(price) : null;
    const formattedRating = rating ? rating.toString() : null;
    const formattedSeats = seats ? parseInt(seats) : null;

    const result = await pool.query(
      `UPDATE movies SET
        title = $1,
        description = $2,
        poster_url = $3,
        release_date = $4,
        show_time = $5::TIME[],
        price = $6,
        seats = $7,
        duration = $8,
        genre = $9,
        language = $10,
        rating = $11,
        trailer_url = $12,
        theater_name = $13
      WHERE id = $14 
      RETURNING *`,
      [
        title, description, poster_url, formattedReleaseDate, formattedShowTime,
        formattedPrice, formattedSeats, duration, genre, language, formattedRating,
        trailer_url, theater_name, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found or you are not the owner' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating movie:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};




export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const { id: admin_id } = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `DELETE FROM movies WHERE id = $1 AND created_by = $2 RETURNING *`,
      [id, admin_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found or you are not the owner' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default router;

