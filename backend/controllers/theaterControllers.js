import { pool } from '../db/db.js';
import express from 'express';

const router = express.Router();
// Get all theaters
export const getAllTheaters = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM theaters');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Get theater by ID
// GET /api/theaters/:id
export const getTheaterById = async (req, res) => {
  const { id } = req.params; // this is the admin's ID
  try {
    const result = await pool.query(
      'SELECT * FROM theaters WHERE created_by = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No theaters found for this admin' });
    }

    res.status(200).json(result.rows); // Return all theaters created by admin
  } catch (error) {
    console.error('Error fetching theater:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getTheatersByMovieTitle = async (req, res) => {
  const { title } = req.params; // expecting movie title in the route param

  try {
    const result = await pool.query(`
      SELECT t.*, m.title
      FROM movies m
      JOIN theater_movies tm ON m.id = tm.movie_id
      JOIN theaters t ON t.id = tm.theater_id
      WHERE LOWER(m.title) = LOWER($1);
    `, [title]);

    res.json(result.rows); // returns an array of theaters showing the specified movie
  } catch (err) {
    console.error('Error fetching theaters by movie title:', err);
    res.status(500).json({ message: 'Failed to fetch theaters for movie' });
  }
};


export const createTheater = async (req, res) => {
  const { name, location } = req.body;
  console.log("Decoded user:", req.user); // 👈 Add this

  const created_by = req.user?.id;
  if (!created_by) {
    return res.status(400).json({ message: 'Invalid admin - no user ID found in token' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO theaters (name, location, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, location, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating theater:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Update a theater
export const updateTheater = async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  try {
    const result = await pool.query(
      'UPDATE theaters SET name = $1, location = $2 WHERE id = $3 RETURNING *',
      [name, location, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating theater:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Delete a theater
export const deleteTheater = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM theaters WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.status(200).json({ message: 'Theater deleted successfully' });
  } catch (error) {
    console.error('Error deleting theater:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Export the router
export default router;
