import { Request, Response } from "express";
import { Logging } from "../library/logging";
import Product, { IProduct } from "../models/product.model";
import Category, { ICategory } from "../models/category.model";

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const productList: IProduct[] = await Product.find();
    return res.status(200).json(productList);
  } catch (error: any) {
    Logging.error(error);
    return res
      .status(200)
      .json({ message: "Error in getting product", err: error.message });
  }
};

const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product: IProduct = await Product.findById(id);

    if (!product) return res.status(400).json("Invalid product ID");

    return res.status(200).json(product);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "Error in geting product with given ID",
      err: e.message,
    });
  }
};

const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    richDescription,
    image,
    images,
    brand,
    price,
    category,
    countInStock,
    rating,
    isFeatured,
    dateCreated,
  } = req.body;

  const id: string = req.body.category;
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");
    Logging.info(file);
    const fileName: string = req.file.filename;
    const basePath: string = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/`;

    const existingCategory: ICategory | null = await Category.findById(id);
    if (!existingCategory)
      return res.status(400).json({ message: "Invalid category ID" });

    const newProduct: IProduct = new Product({
      name,
      description,
      richDescription,
      image: `${basePath}${fileName}`,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      isFeatured,
      dateCreated,
    });
    await newProduct.save();
    return res.status(200).json(newProduct);
  } catch (error: any) {
    Logging.error(error);
    return res.status(400).json({
      message: "An error occurred while creating new prouct",
      err: error.message,
    });
  }
};

const productImagesUpdate = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const files = req.files;
  const imagePath: any[] = [];
  const basePath: string = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/`;

  if (files) {
    files.forEach((file) => {
      imagePath.push(`${basePath}${file.filename}`);
    });
  }

  try {
    const product: IProduct | null = await Product.findByIdAndUpdate(
      id,
      { images: imagePath },
      { new: true }
    );
    if (!product)
      return res.status(400).json({ message: "Invalid product Id" });
    return res.status(200).json(product);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occurred while updating product images",
      err: e.message,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    richDescription,
    image,
    images,
    brand,
    price,
    category,
    countInStock,
    rating,
    isFeatured,
    dateCreated,
  } = req.body;

  const productId = req.params.id;

  const existingCategory: ICategory = await Category.findById(
    req.body.category
  );
  if (!existingCategory) return res.status(400).json("Invalid category ID");

  try {
    const product: IProduct | null = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        richDescription,
        image,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        isFeatured,
        dateCreated,
      },
      { new: true }
    );

    if (!product) return res.status(400).json("Invalid product ID");

    return res.status(200).json(product);
  } catch (e: any) {
    Logging.error(e);
    return res
      .status(400)
      .json({ message: "Error in updaing product", err: e.message });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product: IProduct | null = await Product.findByIdAndRemove(id);

    if (!product) return res.status(400).json("Invalid product ID");

    return res.status(200).json("product successfully deleted");
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({
      message: "An error occured while deleting the product with the given ID",
      err: e.message,
    });
  }
};

const featuredProduct = async (req: Request, res: Response) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const product: IProduct[] = await Product.find({ isFeatured: true }).limit(
      +count
    );

    return res.status(200).json(product);
  } catch (error: any) {
    Logging.error(error);
    return res.status(400).json({
      message: "An error occured while fetching featured products",
      err: error.message,
    });
  }
};

const productCount = async (req: Request, res: Response) => {
  try {
    const query = { product: Product };
    const countProduct: number = await Product.countDocuments(query);
    return res.status(200).json(countProduct);
  } catch (error: any) {
    Logging.error(error);
    return res.status(400).json({
      message: "An error occured while geting the product count",
      err: error.message,
    });
  }
};

export {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  featuredProduct,
  productCount,
  productImagesUpdate,
};
