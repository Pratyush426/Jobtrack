const User = require('../models/User');

exports.syncUser = async (req, res) => {
    try {
        const { email, full_name, resume_url, linkedin_url, gmail_connected } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Upsert user: update if exists, insert if not
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    name: full_name,
                    resume_url,
                    linkedin_url,
                    gmail_connected
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (err) {
        console.error("Sync user error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Map to profile format expected by frontend
        const profile = {
            id: user._id,
            user_id: user._id, // use same ID for now
            email: user.email,
            full_name: user.name,
            resume_url: user.resume_url,
            linkedin_url: user.linkedin_url,
            gmail_connected: user.gmail_connected,
            created_at: user.createdAt,
            updated_at: user.createdAt // simplistic
        };

        res.status(200).json({ success: true, profile });

    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};
