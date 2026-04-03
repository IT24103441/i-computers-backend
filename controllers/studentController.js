 import Student from '../model/student.js'

 export function getAllStudents(req, res) {
     Student.find().then(
        (Students) => {
            res.json(Students)
        }
     )
}

export function createStudent(req, res) {
   if(req.user == null ){
    res.status(401).json({ message: "Unauthorized" })
    return;
   }

   if(req.user.isAdmin == false) {
    res.status(403).json({ message: "only admins can create students" })
    return;
   }

   const newStudent = new Student(req.body)
   newStudent.save().then(
       () => {
           res.json({
               message: "Student saved successfully"
           })
    }
)

}