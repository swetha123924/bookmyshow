import express from 'express';
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getMovieAdmin
} from '../controllers/movieController.js';
import { verifyAdmin } from '../auth/auth.js';


const router = express.Router();
router.post('/', verifyAdmin, createMovie);       // Admin create
router.get('/', getAllMovies);                    // Public get all
router.get('/:id', getMovieById);                 // Public get one
router.put('/:id', verifyAdmin, updateMovie);     // Admin update
router.delete('/:id', verifyAdmin, deleteMovie);  // Admin delete
router.get('/admin/:id', verifyAdmin, getMovieAdmin); // ✅ Fixed admin-specific fetch

export default router;
