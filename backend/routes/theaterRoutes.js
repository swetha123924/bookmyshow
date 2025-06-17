import express from 'express';
import {
  getAllTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
  getTheatersByMovieTitle,
  getTheaterById
} from '../controllers/theaterControllers.js';

import { verifyAdmin } from '../auth/auth.js';

const router = express.Router();

router.get('/', getAllTheaters); // GET /api/theaters
router.get('/admin/:id', verifyAdmin, getTheaterById);
 // ✅ GET /api/theaters/:id
router.post('/', verifyAdmin, createTheater); // POST /api/theaters
router.put('/:id', verifyAdmin, updateTheater); // PUT /api/theaters/:id
router.delete('/:id', verifyAdmin, deleteTheater); // DELETE /api/theaters/:id
router.get("/by-movie-title/:title", getTheatersByMovieTitle); // GET /api/theaters/by-movie-title/Inception

export default router;
