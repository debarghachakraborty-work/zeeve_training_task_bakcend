import express from 'express';
import { signUp,login , logout} from '../controllers/user.controller.js';
import passport from '../lib/googleAuth.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
)

router.get('/google/callback',
    passport.authenticate('google',{
        failureRedirect:'/login',
        session:false,
    }),
    async(req,res)=>{
        //authentication done so redirect it TODO
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    }
)
router.post('/signup',signUp);
router.post('/login',login);
router.post('/logout',logout);

export default router;