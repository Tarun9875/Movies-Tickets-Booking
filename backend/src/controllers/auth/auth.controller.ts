//backend/src/controllers/auth/auth.controller.ts
import { authService } from "../../services";

/* ============================
   REGISTER
============================ */
export const register = async (req: any, res: any) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      user
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ============================
   LOGIN
============================ */
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const data = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      ...data
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ============================
   GOOGLE LOGIN
============================ */
export const googleAuth = async (req: any, res: any) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required"
      });
    }

    const data = await authService.googleLoginUser(token);

    res.status(200).json({
      success: true,
      ...data
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
