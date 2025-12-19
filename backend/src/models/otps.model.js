import pool from '../../config/db.js';

export async function createOtp(userId, otp, expiresAt) {
  const query = `
    INSERT INTO otps (user_id, otp, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [userId, otp, expiresAt]);
  return rows[0];
}

export async function getLatestOtpForUser(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM otps WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return rows[0];
}

export async function deleteOtpsForUser(userId) {
  await pool.query(`DELETE FROM otps WHERE user_id = $1`, [userId]);
}
