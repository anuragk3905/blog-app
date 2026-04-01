import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";
import { UserTypeModel } from "../models/UserModel.js";
export const adminRoute = express.Router();

//Read all articles (optional)
//Block user roles
adminRoute.post('/block/:id', verifyToken, checkAdmin, async(req,res)=>{
    //get user id
    let userId = req.params.id;
    //find user in db
    let userObj = await UserTypeModel.findById(userId);
    //if user is not found
    if(!userObj){
        res.status(401).json({message : "User not found"})
    }
    //block user
    let blockedUser = await UserTypeModel.findByIdAndUpdate(userId,{
        $set : {isActive : false}
    },{new : true})
    res.json({message : "User blocked", payload : blockedUser})
})
//Unblock user roles
adminRoute.post('/unblock/:id', verifyToken, checkAdmin, async(req,res)=>{
    //get user id
    let userId = req.params.id;
    //find user in db
    let userObj = await UserTypeModel.findById(userId);
    //if user is not found
    if(!userObj){
        res.status(401).json({message : "User not found"})
    }
    //unblock user
    let unBlockedUser = await UserTypeModel.findByIdAndUpdate(userId,{
        $set : {isActive : true}
    },{new : true})
    res.json({message : "User unblocked", payload : unBlockedUser})
})