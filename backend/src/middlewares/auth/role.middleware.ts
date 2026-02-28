// middlewares/role.middleware.ts

export const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });

  next();
};