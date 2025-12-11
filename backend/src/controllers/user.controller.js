import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
} from "../models/users.model.js"
import { generateToken } from "../lib/util.js";
//todo: add jwt token generation
//this controller is for signup
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
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


