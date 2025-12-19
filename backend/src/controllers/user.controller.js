import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
} from "../models/users.model.js"
import { generateToken } from "../lib/util.js";
import { createOtp, getLatestOtpForUser, deleteOtpsForUser } from "../models/otps.model.js";
import { sendOtpEmail } from "../lib/mailer.js";

//this controller is for signup
export const signUp = async (req, res) => {
  try {
    const { name, email, 
      password 

    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !email.includes("@") ||
      !email.includes(".") ||
      name.length < 2
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    if (password.length < 6 || password.length > 20) {
      return res
        .status(400)
        .json({ message: "Password must be between 6 and 20 characters" });
    }
    const exsistingUser = await getUserByEmail(email);
    if (exsistingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    //hashing the password need a salt TODO: add salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await createUser({ name, email, password: hashedPassword });
    if(newUser){
        generateToken(newUser.id,res);
    }
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



//this controller is for login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid credentials" });
    };
    //as from the upper if password valid then generate the token
    generateToken(existingUser.id,res);
    //did not send the password in response
    const sentUserData = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email
    };
    res.status(200).json({message: "Login successful",
  user: sentUserData
});

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const logout = (req, res) => {
  try{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"logged out successfully"})
  }catch(error){
    console.log("Error in logout controller",error.message);
    return res.status(500).json({message:"internal server error"})
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and otp required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const latest = await getLatestOtpForUser(user.id);
    if (!latest) return res.status(400).json({ message: 'No OTP found' });

    if (new Date(latest.expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (String(latest.otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP valid — remove existing otps and issue token
    await deleteOtpsForUser(user.id);
    generateToken(user.id, res);

    const sentUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({ message: 'OTP verified', user: sentUserData });
  } catch (error) {
    console.log('Error in verifyOtp controller', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await createOtp(user.id, otp, expiresAt);
    await sendOtpEmail(user.email, otp);

    return res.status(200).json({ message: 'OTP resent' });
  } catch (error) {
    console.log('Error in resendOtp controller', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//containerize fe + be
//run
