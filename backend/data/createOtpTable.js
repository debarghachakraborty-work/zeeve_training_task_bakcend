import pool from '../config/db.js';

const createOtpTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      otp VARCHAR(10) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;
  try {
    await pool.query(query);
    console.log('otps table ready');
  } catch (err) {
    console.error('Error creating otps table', err.message);
  }
};

export default createOtpTable;
