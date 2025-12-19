
import express from 'express';
import { signUp, login, logout, verifyOtp, resendOtp } from '../controllers/user.controller.js';
import passport from '../lib/googleAuth.js';
import { createOtp } from '../models/otps.model.js';
import { sendOtpEmail } from '../lib/mailer.js';
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: false,
    }),
    async (req, res) => {
        // User is available on req.user but we do NOT issue JWT yet.
        const user = req.user;
        if (!user || !user.email) {
            return res.redirect(`${process.env.FRONTEND_URL}/login`);
        }

        // generate OTP, persist and try to email it
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        try {
            await createOtp(user.id, otp, expiresAt);
        } catch (err) {
            console.error('Error creating OTP', err?.message || err);
            // even if DB insert fails, redirect back to frontend login
            return res.redirect(`${process.env.FRONTEND_URL}/login`);
        }

        try {
            await sendOtpEmail(user.email, otp);
        } catch (err) {
            console.error('Failed to send OTP email:', err?.message || err);
            // don't block the user because of email issues — redirect to OTP page anyway
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/success?email=${encodeURIComponent(user.email)}&emailSent=false`
            );
        }

        // Redirect to frontend OTP verification page with email query
        res.redirect(
            `${process.env.FRONTEND_URL}/auth/success?email=${encodeURIComponent(user.email)}`
        );
    }
);

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router;