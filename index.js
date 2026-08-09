import express from 'express'
import mongoose from 'mongoose'
import userRouter from "./Router/userRouter.js";
import { authenticate } from './middlewares/authenticate.js';
import productRouter from "./Router/productRouter.js";
import dotenv from 'dotenv'
import cors from 'cors'
import orderRouter from './Router/orderRouter.js';
import reviewRouter from './Router/reviewRouter.js';
import contactRouter from './Router/contactRouter.js';

dotenv.config()
const app = express()
const mongoDBURI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        if (!mongoDBURI) {
            throw new Error("MONGO_URI is not defined in .env");
        }
        await mongoose.connect(mongoDBURI)
        console.log("Connected to MongoDB")
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message)
        console.log("Attempting fallback to In-memory MongoDB server...")
        try {
            const { MongoMemoryServer } = await import('mongodb-memory-server')
            const mongoServer = await MongoMemoryServer.create()
            const fallbackURI = mongoServer.getUri()
            await mongoose.connect(fallbackURI)
            console.log("Connected to Fallback In-memory MongoDB at:", fallbackURI)
        } catch (fallbackErr) {
            console.error("Failed to start fallback in-memory MongoDB. Please configure a valid MONGO_URI in .env:", fallbackErr.message)
        }
    }
}

connectDB()

app.use(cors())
app.use(express.json())

app.use(authenticate)

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/contacts", contactRouter)




app.listen(3000,
    () => { console.log("Server is running on port 3000") }
)  