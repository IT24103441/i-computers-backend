import mongoose from "mongoose";
 
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: String
})

const Student = mongoose.model("student", studentSchema)

export default Student