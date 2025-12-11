import jwt from "jsonwebtoken";
//get the function //take the payload
//generate the token
export const generateToken = (userId,res)=>{
    const token =  jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    //set the token in the cookie
    res.cookie("jwt",token,{//jwt is the given name
        maxAge: 7*24*60*60*1000,//7 days    
        httpOnly:true,//to make it secure xss attacks
        sameSite:"strict",//to make it secure from csrf attacks
        secure: process.env.NODE_ENV !== "development" //to make it secure from csrf attacks
    })

    return token;
}