import express from 'express';
import cors from 'cors';
import pool from '../config/db.js'
import passport from 'passport';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import createUserTable from '../data/createUserTable.js'
import authRoutes from './routes/auth.route.js'
dotenv.config();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
  }
));

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//create the user table if not exists
createUserTable();

app.use('/api/auth',authRoutes);
app.get('/',async(req,res)=>{
    const result = await pool.query('SELECT current_database()')
    res.send(`the database name is : ${result.rows[0].current_database}`);
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});