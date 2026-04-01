import { UserTypeModel } from "../models/UserModel.js";

export const checkAdmin = async (req,res,next)=>{
    //get user id
    let userId = req.body?.adminId;
    //verify user
    let user = await UserTypeModel.findById(userId);
    if(!user){
        return res.status(401).json({message : "Invalid admin"})
    }
    //if user found but role is different
    if(user.role!= "ADMIN"){
        return res.status(403).json({message : "User is not admin"})
    }
    //forward req to next
    next();
}