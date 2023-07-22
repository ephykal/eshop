import { Request, Response } from "express";
import { Logging } from "../library/logging";
import Category, { ICategory } from "../models/category.model";

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const categoryList: ICategory[] = await Category.find();
    return res.status(200).json(categoryList);
  } catch (error: any) {
    Logging.error(error);
    return res
      .status(500)
      .json({ message: "Error while getting categories", err: error.message });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const category: ICategory | null = await Category.findById(id);

    if (!category) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    return res.status(200).json(category);
  } catch (error: any) {
    Logging.error(error);
    return res.status(400).json({
      message: "Error while getting categories with given ID",
      err: error.message,
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  const { name, icon, color, image } = req.body;
  try {
    const newCategory: ICategory = new Category({ name, icon, color, image });
    await newCategory.save();
    return res.status(200).json(newCategory);
  } catch (error: any) {
    Logging.error(error);
    return res.status(400).json({
      message: "Error encountered while creating category",
      err: error.message,
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const { name, icon, color, image } = req.body;
  const id: string = req.params.id;
  try {
    const category: ICategory | null = await Category.findByIdAndUpdate(
      id,
      { name, icon, color, image },
      { new: true }
    );
    if (!category) return res.status(400).json({ message: "Invalid ID" });

    return res.status(200).json(category);
  } catch (error: any) {
    Logging.error(error);
    return res.status(400).json({
      message: "Error occurred whie updating category",
      err: error.message,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const category: ICategory | null = await Category.findByIdAndRemove(id);

    if (!category) return res.status(400).json({ message: "Invalid ID" });

    return res
      .status(200)
      .json({ message: "category with given ID successfully deleted" });
  } catch (error: any) {
    Logging.error(error);
    return res.status(400).json({
      message: "Error occurred while deleting category",
      err: error.message,
    });
  }
};

export {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
