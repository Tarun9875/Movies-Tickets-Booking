import { Request, Response } from "express";
import User from "../../models/User.model";

/* =====================================
   GET ALL USERS (Admin)
===================================== */
export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};


/* =====================================
   UPDATE USER (Role / Status)
===================================== */
export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Only allow updating role & status
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user"
    });
  }
};


/* =====================================
   DELETE USER
===================================== */
export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};