import express from "express";
import { authenticate } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
export const commonRouter = express.Router();

//login
commonRouter.post('/login',async(req,res)=>{
    //get user cred object
    let userCred = req.body;
    //call authenticate service
    let {token, user} = await authenticate(userCred);
    //save token as httpOnly cookie
    res.cookie("token", token, {
        httpOnly : true,
        sameSite : "lax",
        secure : false
    })
    //send res
    res.status(200).json({message : "login success", payload : user})
})

//logout
commonRouter.get('/logout',async(req,res)=>{
    //clear the cookie named 'token'
    res.clearCookie('token',{
        httpOnly : true,     //Must match original settings
        secure : false,      //Must match original settings
        sameSite : "lax"     //Must match original settings
    });
    res.status(200).json({message : 'Logged out successfully'});
})

//change password (protected route)
commonRouter.put('/change-password', verifyToken, async(req,res)=>{
    //get current password and new password
    let {email, currPassword, newPassword} = req.body;
    //check the current password is correct or not
    await authenticate({email:email, password:currPassword})
    //replace current password with new password(hash)
    let hashNewPassword = await bcrypt.hash(newPassword,10);
    await UserTypeModel.findOneAndUpdate({email:email},{
        $set : {password : hashNewPassword}
    },{new : true})

    //send res
    res.status(200).json({message : "Password changed successfully"})
})

// page refresh
commonRouter.get('/check-auth',verifyToken("USER","AUTHOR"), async(req,res)=>{
    res.status(200).json({message : 'authenticated', payload : req.user});
})