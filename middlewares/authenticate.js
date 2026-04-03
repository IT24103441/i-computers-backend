import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()
export function authenticate(req, res, next){
    const header = req.headers['authorization']
    if(header == null ) {
        next()
    } else {
        const token = header.replace("Bearer ", "")
        jwt.verify(token, process.env.JWT_SECRET_KEY, 
        (err, decoded) => {
            if(decoded != null) {
                req.user = decoded
                next()
            } else {
                res.status(401).json({ message: "Invalid or expired token" })
            }
        })
    }
}