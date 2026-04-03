import express from 'express'
import Student from '../model/student.js'
import { createStudent} from '../controllers/studentController.js'

const studentRouter = express.Router()

studentRouter.post("/",createStudent)

export default studentRouter