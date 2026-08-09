import Review from "../model/review.js";

// Create a new review (Public / Authenticated User)
export async function createReview(req, res) {
    try {
        const { productId, productName, rating, title, comment, userName, userEmail, userImage } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required." });
        }

        let name = userName;
        let email = userEmail;
        let image = userImage || "/default-profile.png";

        if (req.user) {
            name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
            email = req.user.email;
            image = req.user.image || image;
        }

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required to submit a review." });
        }

        const newReview = new Review({
            productId: productId || null,
            productName: productName || "General Experience",
            userName: name,
            userEmail: email,
            userImage: image,
            rating: Number(rating),
            title: title || "",
            comment: comment,
            status: "approved" // Default to approved so reviews appear immediately
        });

        await newReview.save();
        return res.status(201).json({ message: "Review submitted successfully!", review: newReview });
    } catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({ message: "Failed to submit review", error: error.message });
    }
}

// Get approved reviews for public view (with optional productId filter)
export async function getApprovedReviews(req, res) {
    try {
        const { productId } = req.query;
        const query = { status: "approved" };

        if (productId) {
            query.productId = productId;
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching approved reviews:", error);
        return res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
}

// Admin: Get all reviews (with optional status filter)
export async function getAllReviewsAdmin(req, res) {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }

        const { status } = req.query;
        const query = {};

        if (status && status !== "all") {
            query.status = status;
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching admin reviews:", error);
        return res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
}

// Admin: Update review status (approve, reject, pending)
export async function updateReviewStatus(req, res) {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "pending", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found." });
        }

        return res.status(200).json({ message: "Review status updated.", review: updatedReview });
    } catch (error) {
        console.error("Error updating review status:", error);
        return res.status(500).json({ message: "Failed to update review status", error: error.message });
    }
}

// Admin: Delete a review
export async function deleteReview(req, res) {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }

        const { id } = req.params;
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found." });
        }

        return res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ message: "Failed to delete review", error: error.message });
    }
}
