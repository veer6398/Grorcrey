import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


//register user : /api/user/register
export const register = async (req,res)=>{
    try {
        const {name, email, password} = req.body;

        if(!name ||!email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser)
            return res.json({success: false, message: 'User Already Exists'})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password: hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7D'})

        res.cookie('token', token, {
            httpOnly: true, //prevents js from accesing cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //csrf protection
            maxAge: 7*24*60*60*1000, //cookie expire time
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);    
        res.json({success:false, message: error.message})
    }
}


//login user: /api/user/login
export const login = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password)
            return res.json({success: false, message: 'Email and password are required'});
        
        const user = await User.findOne({email});

        if(!user){
            return res.json({success: false, message: 'invalid user or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
            return res.json({success: false, message: 'invalid user or password'});
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7D'})

        res.cookie('token', token, {
            httpOnly: true, //prevents js from accesing cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //csrf protection
            maxAge: 7*24*60*60*1000, //cookie expire time
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})

    } catch (error) {
        console.log(error.message);    
        res.json({success:false, message: error.message})
    }
}


//check auth: /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
      const userId = req.userId; 
  
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };


//logout user: /api/user/logout
export const logout = async(req, res)=>{
    try {
        res.clearCookie('token',{
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
        })
        return res.json({success: true, message:"Logged Out"})
    } catch (error) {
        console.log(error.message);    
        res.json({success:false, message: error.message})
    }
}