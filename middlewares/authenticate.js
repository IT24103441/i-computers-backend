import jwt from "jsonwebtoken"
export function authenticate(req, res, next){
    const header = req.headers['authorization']
    if(header == null ) {
        next()
    } else {
        const token = header.replace("Bearer ", "")
        jwt.verify(token, "secretKey99!!!!!", 
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