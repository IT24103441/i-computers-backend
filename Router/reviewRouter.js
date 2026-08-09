import express from "express";
import {
    createReview,
    getApprovedReviews,
    getAllReviewsAdmin,
    updateReviewStatus,
    deleteReview
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Public routes
reviewRouter.post("/", createReview);
reviewRouter.get("/", getApprovedReviews);

// Admin routes
reviewRouter.get("/admin/all", getAllReviewsAdmin);
reviewRouter.put("/admin/:id/status", updateReviewStatus);
reviewRouter.delete("/admin/:id", deleteReview);

export default reviewRouter;
