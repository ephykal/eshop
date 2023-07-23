import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { Logging } from "../library/logging";
const secret = process.env.secret;

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(400).json("Unauthorized");

    try {
      const decoded = jwt.verify(token, secret);
      const userId = decoded.userId;
      const user:IUser|null = await User.findById(userId);

      if (!user) return res.status(200).json("Unauthorized ID");

      req.user = user;

      if (user.isAdmin) {
        next();
      } else {
        return res.status(401).json("Unauthorized: Admin access is required");
      }
    } catch (error: any) {
      Logging.error(error);
      return res
        .status(401)
        .json({ message: "Expired Token", err: error.message });
    }
  } catch (error: any) {
    Logging.error("Failed to authenticate", error);
    res.status(500).json({ message: "Failed to authenticate" });
  }
};

export default authUser;
