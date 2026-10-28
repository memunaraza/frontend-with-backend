import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/environment.js"

export function authenticateToken(req,res,next){
    const token = req.cookies?.token;

    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        req.user = jwt.verify(token, getJwtSecret())
        next()
    }catch(err){
        res.status(401).json({
            message:"Invalid Token",
            err: err.message
        })
    }

}
export function requireAdmin(req,res,next){
    if( req.user.role !== "admin"){
        return res.status(403).json({
            message:"Forbidden"
        })
    }
    next()
}
