import express from "express";
import { getBookedSeats } from "../controllers/paymentController.js";


const router = express.Router();

router.get("/booked-seats", getBookedSeats);

export default router;
