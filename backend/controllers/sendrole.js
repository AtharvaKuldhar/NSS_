// controllers/sendrole.js
import Volunteer from "../models/Volunteer.js";

export const sendrole = async (req, res, next) => {
    try {
        // req.user is from decoded JWT
        const { id } = req.user;

        // Fetch user from DB (optional, but good for fresh data)
        const user = await Volunteer.findById(id).select("role name email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            role: user.role,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        next(error);
    }
};
// This controller can be used to send the user's role and other details
// after they log in, which can be useful for frontend routing or state management.