import express from 'express'
import mongoose from 'mongoose'
import studentRouter from './Router/studentRouter.js'
import userRouter from "./Router/userRouter.js";
import { authenticate } from './middlewares/authenticate.js';
import productRouter from "./Router/productRouter.js";
const app = express()
const mongoDBURI = "mongodb+srv://Kaweesha:1234@cluster0.lpllm0w.mongodb.net/dev?appName=Cluster0"

mongoose.connect(mongoDBURI).then(() => {
    console.log("Connected to MongoDB")
})
app.use(express.json())

app.use(authenticate)

app.use('/students', studentRouter)
app.use("/users", userRouter)
app.use("/products", productRouter)


app.listen(3000,
    () => {console.log("Server is running on port 3000") }
)  