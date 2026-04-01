import { UserTypeModel } from "../models/UserModel.js";

export const checkUser = async (req,res,next)=>{
    //get user id
    let userId = req.params?.userId;
    //verify user
    let user = await UserTypeModel.findById(userId);
    if(!user){
        return res.status(401).json({message : "Invalid user"})
    }
    //if user found but role is different
    if(user.role!= "USER"){
        return res.status(403).json({message : "User is not user role"})
    }
    //if user blocked
    if(!user.isActive){
        return res.status(403).json({message : "User account is not active"})
    }
    //forward req to next
    next();
}