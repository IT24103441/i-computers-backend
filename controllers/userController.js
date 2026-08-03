import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

export async function createUser(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user != null) {
            res.json({ message: "User already exists" })
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

        if (email == null || password == null) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await User.findOne({ email: email });
        if (user == null) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            }, process.env.JWT_SECRET_KEY);
            res.json({ message: "Login successful", token: token, isAdmin: user.isAdmin });

        } else {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export async function getUser(req,res){

    if(req.user == null){
        res.status(401).json({message : "Unauthorized"})
        return
    }

    try{

        const email = req.user.email

        const user = await User.findOne( {email : email} )

        if(user == null){
            res.status(404).json({message : "User not found"})
            return
        }

        if(user.isBlocked){
            res.status(403).json({message : "User is blocked"})
            return
        }

        res.json({email : user.email , firstName : user.firstName , lastName : user.lastName , isAdmin : user.isAdmin , isBlocked : user.isBlocked , isEmailVerified : user.isEmailVerified , image : user.image})


    }catch(err){
        res.json({message : err.message})
    }
}