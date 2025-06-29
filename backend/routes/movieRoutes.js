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
router.post('/', verifyAdmin, createMovie);       
router.get('/', getAllMovies);                    
router.get('/:id', getMovieById);                
router.put('/:id', verifyAdmin, updateMovie);     
router.delete('/:id', verifyAdmin, deleteMovie);  
router.get('/admin/:id', verifyAdmin, getMovieAdmin); 

export default router;
