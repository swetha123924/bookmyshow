import express from "express";
import { 
    getBookedSeats,
    createPayment

 } from "../controllers/paymentController.js";


const router = express.Router();

router.get("/booked-seats", getBookedSeats);
router.post("/", createPayment)

export default router;
