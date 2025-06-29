import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false, // required for Aiven or similar hosted DBs
  }
});

console.log('ENV:', {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
});


pool.connect()
  .then(() => console.log('✅ Connected to database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Table creation
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. movies
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        poster_url TEXT,
        release_date DATE,
        show_time TIME[],
        price NUMERIC(10, 2),
        seats INTEGER,
        created_by INTEGER,  
        duration VARCHAR(50),
        genre VARCHAR(100),
        language VARCHAR(50),
        rating VARCHAR(10),
        trailer_url TEXT,
        theater_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. theaters
    await pool.query(`
      CREATE TABLE IF NOT EXISTS theaters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        location VARCHAR(200) NOT NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);


    // 5. bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        show_id INTEGER REFERENCES theater_movies(id) ON DELETE CASCADE,
        theater_id INTEGER REFERENCES theaters(id) ON DELETE CASCADE,
        seats JSONB NOT NULL,
        total_price NUMERIC NOT NULL,
        booking_status VARCHAR(50) DEFAULT 'booked',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);


    // 7. theater_movies
    await pool.query(`
      CREATE TABLE IF NOT EXISTS theater_movies (
        id SERIAL PRIMARY KEY,
        theater_id INTEGER REFERENCES theaters(id),
        movie_id INTEGER REFERENCES movies(id),
        showtimes TEXT[],  
        
        UNIQUE (theater_id, movie_id)
      );
    `);


    console.log('✅ All tables created or already exist');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  }
};

createTables();

export { pool };
