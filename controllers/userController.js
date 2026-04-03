import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user != null) {
            res.json({ message: "User already exists"})
            return;
        } 
          const passwordHash = bcrypt.hashSync(req.body.password, 10);
    
       const newUser = new User({
         email: req.body.email,
         firstName: req.body.firstName,
           lastName: req.body.lastName,
           password: passwordHash
       });
        await newUser.save();
        res.json({ message: "User created successfully" });

    } catch (error) {
        res.json({ message: error.message });
    }
}   

export async function loginUser(req, res) {
    try { 
const email = req.body.email;
const password = req.body.password;

if(email == null || password == null) {
    res.json({ message: "Email and password are required" });
    return;
}  
const user = await User.findOne({ email: email });
if(user == null) {
    res.json({ message: "User not found" });
    return;
}

const isPasswordValid = bcrypt.compareSync(password, user.password);

if(isPasswordValid) {
    const token = jwt.sign({ 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        isBlocked: user.isBlocked,
         isEmailVerified: user.isEmailVerified,
          image: user.image
     }, "secretKey99!!!!!");
    res.json({ message: "Login successful", token : token });
    
}else {
    res.json({ message: "Invalid password" });
    return;
}

    }catch (error) {
        res.json({ message: error.message });

    } 
}
