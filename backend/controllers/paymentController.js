// controllers/paymentController.js
import { pool } from '../db/db.js';

export const getBookedSeats = async (req, res) => {
  const { show_id } = req.query;

  if (!show_id) {
    return res.status(400).json({ message: "Missing show_id" });
  }

  try {
    const query = `
      SELECT seats
      FROM bookings 
      WHERE show_id = $1
    `;

    const result = await pool.query(query, [show_id]);
    const bookedSeats = result.rows.map((row) => row.seats); // match column name exactly

    res.status(200).json({ bookedSeats });
  } catch (err) {
    console.error("Error fetching booked seats:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
