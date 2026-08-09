import Contact from "../model/contact.js";

// Submit a new contact message (Public)
export async function createContactMessage(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }

        const newContact = new Contact({
            name,
            email,
            subject: subject || "General Inquiry",
            message,
            status: "pending"
        });

        await newContact.save();
        return res.status(201).json({
            message: "Thank you for reaching out! Your message has been received.",
            contact: newContact
        });
    } catch (error) {
        console.error("Error creating contact message:", error);
        return res.status(500).json({ message: "Failed to submit message", error: error.message });
    }
}

// Get all contact messages (Admin only)
export async function getAllMessagesAdmin(req, res) {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }

        const { status } = req.query;
        const query = {};

        if (status && status !== "all") {
            query.status = status;
        }

        const messages = await Contact.find(query).sort({ createdAt: -1 });
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching contact messages for admin:", error);
        return res.status(500).json({ message: "Failed to fetch messages", error: error.message });
    }
}

// Reply to a contact message (Admin only)
export async function replyContactMessage(req, res) {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }

        const { id } = req.params;
        const { replyMessage } = req.body;

        if (!replyMessage || !replyMessage.trim()) {
            return res.status(400).json({ message: "Reply message cannot be empty." });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            {
                replyMessage: replyMessage.trim(),
                status: "replied",
                repliedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Contact message not found." });
        }

        return res.status(200).json({
            message: `Reply sent successfully to ${updatedContact.email}`,
            contact: updatedContact
        });
    } catch (error) {
        console.error("Error replying to contact message:", error);
        return res.status(500).json({ message: "Failed to send reply", error: error.message });
    }
}

// Delete a contact message (Admin only)
export async function deleteContactMessage(req, res) {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }

        const { id } = req.params;
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ message: "Contact message not found." });
        }

        return res.status(200).json({ message: "Message deleted successfully." });
    } catch (error) {
        console.error("Error deleting contact message:", error);
        return res.status(500).json({ message: "Failed to delete message", error: error.message });
    }
}

// Get messages submitted by current logged-in user
export async function getUserMessages(req, res) {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const messages = await Contact.find({ email: req.user.email }).sort({ createdAt: -1 });
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching user notifications:", error);
        return res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
}

