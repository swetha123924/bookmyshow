import { pool } from '../db/db.js';

export const createBooking = async (req, res) => {
  const { user_id, show_id, seats, total_price } = req.body;

  if (!user_id || !show_id || !Array.isArray(seats) || seats.length === 0 || !total_price) {
  return res.status(400).json({ message: "Missing booking data" });
}


  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, show_id, seats, total_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, show_id, JSON.stringify(seats), total_price]
    );

    res.status(200).json({ message: "Booking successful", booking: result.rows[0] });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
