import User from "../model/user.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import { sendEmailForVerification } from "../middleware/nodemailer.js";

dotenv.config({path: path.resolve('../.env')});
export const registerUser = async(req,res) => {
    const {name, email, username, password, mobile} = req.body;
    try {
        const existMail = await User.findOne({email});
        if(existMail) return res.status(409).json({status: 'failure', message: 'user already exists'});
        const existusername = await User.findOne({username});
        if(existusername) return res.status(409).json({status: 'failure', message: 'username already exists'});
        const token = jwt.sign({email},process.env.jwt_secret,{expiresIn: '1h'})
        const user = new User(req.body);
        console.log(req.body);
        user.password = await bcrypt.hash(password,8);
        user.token = token;
        await user.save();
        res.status(201).json({status: 'success', message: 'Registered Successfully'});
        await sendEmailForVerification(email,token);

    }
    catch (err) {
        console.log(err);
        
        res.status(500).json({status: 'failure', message: err.message});
    }
}

export const loginUser = async(req,res) => {
      const {email, password} = req.body;
      try {
        const user = await User.findOne({email: email}).select("-token");
        if(!user) return res.status(404).json({status: 'failure', message: 'User not found'});
        console.log(user);
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({status: 'failure', message: 'Incorrect password'});
        const token = jwt.sign({email: user.email}, process.env.jwt_secret, {expiresIn: '1h'});
        if(!user.isEmailVerified) {
            return res.status(403).json({status: 'failure', message: 'Email not verified'});
        }

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.node_env === 'production',
            maxAge: 24 *60 * 60 * 1000
        });

        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            user: user // Include any additional data as needed
        });
      }
      catch(err) {
        console.log(err);
        return res.status(500).json({status: 'failure', message: err.message});
      }
}

export const logOut = (req, res) => {
    try {
        console.log(req.cookies.token)
        res.clearCookie("token");
        res.json({status: 'success', message: 'Logged out'});

    } catch(err) {
        console.log(err);
        res.status(500).json({status: 'failure', message: err.message});
        }    
    }

export const registerAsSeller = async(req, res) => {
    try {
        const { email, username } = req.body;
        const chk = await User.find({username});
        if(chk.role=="seller") {
            return res.status(403).json({status: 'failure', message: 'username already in use.'});
        }
        const user = await User.findOne({email: email});
        if(user && user.role=='buyer') {
            try {

                const updatedUser = await User.findByIdAndUpdate(user._id, {role: 'seller'});
                return res.status(200).json({status: 'success', message: 'Account upgraded to seller', user: updatedUser});
            }
            catch(err) {
                console.log(err);
                return res.status(500).json({status: 'failure', message: 'Error updating user role'});
            }
        }
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const token = jwt.sign({ email }, process.env.jwt_secret, { expiresIn: "1hr" });
        const newUser = new User({...req.body, role: 'seller'});   
        await newUser.save();
        await sendEmailForVerification(email, token);
        return res.status(201).json({status: 'success', message: 'User registered as seller', user: newUser});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({status: 'failure', message: err.message});
    }
}