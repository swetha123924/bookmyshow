import { pool } from '../db/db.js';


export const createBooking = async (req, res) => {
  const { user_id, show_id, theater_id, seats, total_price } = req.body;

  console.log("🟢 Received booking request with data:", {
    user_id,
    show_id,
    theater_id,
    seats,
    total_price,
  });

  const parsedTheaterId = parseInt(theater_id, 10); // Ensure it's a number

  console.log("🔍 Parsed types:", {
    user_id: typeof user_id,
    show_id: typeof show_id,
    theater_id: typeof theater_id,
    parsedTheaterId,
    parsedType: typeof parsedTheaterId,
    seatsType: Array.isArray(seats) ? "array" : typeof seats,
    total_price: typeof total_price,
  });

  // Validate input
  if (
    !user_id ||
    !show_id ||
    !parsedTheaterId ||
    !Array.isArray(seats) ||
    seats.length === 0 ||
    !total_price
  ) {
    console.warn("⚠️ Validation failed");
    return res.status(400).json({ message: "Missing booking data" });
  }

  try {
    const query = `
      INSERT INTO bookings (user_id, show_id, theater_id, seats, total_price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [
      user_id,
      show_id,
      parsedTheaterId,
      JSON.stringify(seats), // jsonb format
      total_price,
    ];

    console.log("📤 Running query with values:", values);

    const result = await pool.query(query, values);

    console.log("✅ Booking insert result:", result.rows[0]);

    res.status(201).json({
      message: "Booking successful",
      booking: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
