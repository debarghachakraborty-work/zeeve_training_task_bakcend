import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from '../../config/db.js';


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails?.[0]?.value;

        // Check if user exists
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [googleId]
        );

        let user;

        if (existingUser.rows.length > 0) {
          user = existingUser.rows[0];
        } else {
          const newUser = await pool.query(
            `INSERT INTO users (name, email, google_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, email, googleId]
          );
          user = newUser.rows[0];
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
