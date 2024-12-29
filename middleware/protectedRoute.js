import User from "../model/user.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
export const verifyCookies = async(req, res, next) => {
    if(req.query.token) {
        console.log(req.query.token)
        try {
            const decoded = jwt.verify(req.query.token, process.env.jwt_secret);
            const user = await User.findOne({email: decoded.email});
            if(!user) {
                return res.status(404).json({
                    status: 'failure',
                    message: 'User not found',
                    isAuthenticated: false
                })
            }
            await User.findByIdAndUpdate(user._id, {isEmailVerified: true})
            return res.json({
                status:'success',
                message: 'email is verified',
            });
        }
        catch (error) {
            if(error.name=='TokenExpiredError') {
                try {
                    const user = await User.findOne({token: token});
                    if(!user) return res.status(404).json({status: 'failure', message: 'User not found'});
                    const newToken = jwt.sign({email: user.email}, process.env.jwt_secret,{expiresIn: '1h'});
                    user.token = newToken;
                    await user.save();
                    await sendEmailForVerification(user.email,newToken);
                    res.json({status:'success', message: 'Your token was expired. Email verification link sent again'});
                }
                catch (error) {
                    res.status(500).json({status: 'failure', message: error.message});
                }
            }
            else {
                return res.status(401).json({
                    status: 'failure',
                    message: error.message,
                    isAuthenticated: false
                })
            }
        }
    }
    if (req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.jwt_secret);
            const user = await User.findOne({email: decoded.email}).select('-password');
            if(!user) {
                return res.status(404).json({
                    status: 'failure',
                    message: 'User not found',
                    isAuthenticated: false
                })
            }
            req.user = user;
        } catch (error) {
            if(error.name=='TokenExpiredError') {
                return res.status(440).json({
                    status: 'failure',
                    message: 'Your session is over. Login again.',
                    isAuthenticated: false
                })
            }
            else {
                return res.status(401).json({
                    status: 'failure',
                    message: 'Invalid token',
                    isAuthenticated: false
                })
            }
        }
    }

    else {
        return res.status(400).json({
            status: 'failure',
            message: 'log in to access',
            isAuthenticated: false
        })
    }
    next();
}