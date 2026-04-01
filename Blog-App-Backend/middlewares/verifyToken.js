import { config } from "dotenv";
import jwt from "jsonwebtoken";
config()

export const verifyToken = (...allowedRoles)=>{
    return async(req,res,next)=>{
        try{
            //read token from req
            let token = req.cookies.token;
            if(token === undefined){
                return res.status(401).json({message : "Unauthorised request. Please login"})
            }
            //verify the validity of the token (decoding the token)
            let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // check if role is allowed
            if(!allowedRoles.includes(decodedToken.role)){
                return res.status(403).json({message: "Forbidden. You don't have access."})
            }
            // attach user info to req for use in routes
            req.user = decodedToken
            //forward req to next middleware or route
            next();
        }catch(err){
            // jwt.verify throws if token is invalid/expired
            if(err.name === "TokenExpiredError"){
                return res.status(401).json({message: "Session expired. Please login again"})
            }
            if(err.name === "JsonWebTokenError"){
                return res.status(401).json({message: "Invalid token. Please login again"})
            }
            // next(err);
        }
    }
}