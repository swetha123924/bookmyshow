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

export const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing user id" });
  }

  try {
    const query = `
      SELECT 
        b.id,
        b.seats,
        b.total_price,
        b.created_at,
        b.booking_status,
        m.title,
        m.poster_url,
        m.language,
        m.duration,
        t.name AS theater_name
      FROM bookings b
      LEFT JOIN theater_movies tm ON b.show_id = tm.id
      LEFT JOIN movies m ON tm.movie_id = m.id
      LEFT JOIN theaters t ON b.theater_id = t.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    const bookings = result.rows.map((row) => ({
      ...row,
      seats: typeof row.seats === "string" ? JSON.parse(row.seats) : row.seats,
    }));

    res.json({ bookings });
  } catch (err) {
    console.error("❌ Error fetching user bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
