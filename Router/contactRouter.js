import express from "express";
import {
    createContactMessage,
    getAllMessagesAdmin,
    replyContactMessage,
    deleteContactMessage,
    getUserMessages
} from "../controllers/contactController.js";

const contactRouter = express.Router();

// Public / User routes
contactRouter.post("/", createContactMessage);
contactRouter.get("/my-messages", getUserMessages);

// Admin routes
contactRouter.get("/admin", getAllMessagesAdmin);
contactRouter.post("/admin/:id/reply", replyContactMessage);
contactRouter.delete("/admin/:id", deleteContactMessage);

export default contactRouter;

