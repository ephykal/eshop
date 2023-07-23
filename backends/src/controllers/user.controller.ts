import { Request, Response } from "express";
import { Logging } from "../library/logging";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const userList: IUser[] = await User.find();
    return res.status(200).json(userList);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({ message: "Error in getting in all users" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user: IUser | null = await User.findById(id);

    if (!user) return res.status(400).json("Invalid user ID");

    return res.status(200).json(user);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occured while getting user with the given ID",
      err: e.message,
    });
  }
};

const getUserCount = async (req: Request, res: Response) => {
  try {
    const query: IUser = { user: User };
    const countUser: number = await User.countDocuments(query);
    return res.status(200).json(countUser);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occured while getting a count of users",
      err: e.message,
    });
  }
};

const getUserIsAdmin = async (req: Request, res: Response) => {
  try {
    const user: IUser[] = await User.find({ isAdmin: true });
    return res.status(200).json(user);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occured while getting a count of users",
      err: e.message,
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    street,
    apartment,
    city,
    zip,
    country,
    phone,
    isAdmin,
  } = req.body;
  try {
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "this email already existings" });
    }

    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);

    const newUser: IUser = new User({
      name,
      email,
      password: hash,
      street,
      apartment,
      city,
      zip,
      country,
      phone,
      isAdmin,
    });
    await newUser.save();
    return res.status(200).json(newUser);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occured while creating a new user",
      err: e.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const secret: string = process.env.secret;
  try {
    const user: any = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid email");

    const isPasswordValid: boolean = await bcrypt.compare(
      String(password),
      String(user.password)
    );
    if (!isPasswordValid)
      return res
        .status(400)
        .json("Invalid password, your password does not match");

    const token: string = jwt.sign({ userId: user }, secret, {
      expiresIn: "1h",
    });

    return res.status(200).json({ user: user.email, token: token });
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occured while logging in the user",
      err: e.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndRemove(id);
    if (!user) return res.status(400).json("Invalid user ID");
    return res.status(200).json("user with given ID successfully deleted");
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occured while deleting the user",
      err: e.message,
    });
  }
};

export {
  getAllUser,
  createUser,
  getUserById,
  getUserCount,
  getUserIsAdmin,
  loginUser,
  deleteUser,
};
