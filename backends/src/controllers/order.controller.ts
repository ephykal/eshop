import { Request, Response } from "express";
import { Logging } from "../library/logging";
import Order, { IOrder } from "../models/order.model";
import OrderItem, { IOrderItme } from "../models/orderItem.model";
import User, { IUser } from "../models/user.model";
import mongoose from "mongoose";

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orderList: IOrder[] = await Order.find().populate("user", "name");
    return res.status(200).json(orderList);
  } catch (e: any) {
    Logging.error(e);
    return res.status(400).json({ message: "Error in getting all orders" });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    const order: IOrder | null = await Order.findById(id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });
    if (!order) {
      return res.status(400).json("Invalid ID");
    }
    return res.status(200).json(order);
  } catch (e: any) {
    Logging.error(e);
    return res
      .status(400)
      .json({ message: "Error in getting order with given ID" });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderItemIds: string[] = await Promise.all(
      req.body.orderItems.map(
        async (orderItem: { quantity: any; product: any }) => {
          let newOrderItem: IOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
          });
          Logging.info(req.body.orderItem);
          await newOrderItem.save();
          return newOrderItem._id;
        }
      )
    );

    const totalPrices: number[] = await Promise.all(
      orderItemIds.map(async (orderItemId) => {
        const orderItem: IOrderItems | null = await OrderItem.findById(
          orderItemId
        ).populate("product", "price");

        if (!orderItem) throw new Error("Order item not found");

        const totalPrice: number = orderItem.product.price * orderItem.quantity;
        if (isNaN(totalPrice)) throw new Error("Invalid total price");

        return totalPrice;
      })
    );

    const {
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      user,
      dateOrdered,
    } = req.body;

    const newOrder: IOrder = new Order({
      orderItems: orderItemIds,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice: totalPrices.reduce((a, b) => a + b, 0),
      user,
      dateOrdered,
    });

    await newOrder.save();
    return res.status(200).json(newOrder);
  } catch (error) {
    Logging.error(error);
    return res
      .status(400)
      .json({ message: "Can't create order", err: error.message });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { status } = req.body;
  try {
    const order: IOrder | null = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) return res.status(400).json("Invalid order ID");
    return res.status(200).json(order);
  } catch (e: any) {
    Logging.error(e);
    return res
      .status(400)
      .json({ message: "Can't update order", err: e.message });
  }
};

const deletOrder = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: 'Invalid order ID' });
    // }
    const order = await Order.findByIdAndRemove(id);
    if (!order) return res.status(400).send("Invalid order ID");
    return res.status(200).json("Successfully deleted user with given ID");
  } catch (e: any) {
    Logging.error(e);
    return res
      .status(400)
      .json({ message: "Can't delete order", err: e.message });
  }
};

const countOrder = async (req: Request, res: Response) => {
  const count: IOrder = { order: Order };
  try {
    const order: number = await Order.countDocuments(count);
    return res.status(200).json(order);
  } catch (e: any) {
    Logging.error(e);
    return res
      .status(400)
      .json({ message: "Error can't count order", err: e.message });
  }
};

const getOrderByUserId = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const order: IOrder | null = await Order.find({ userId })
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    if (!order) {
      return res.status(404).json({ message: "No orders found for the user" });
    }

    return res.status(200).json(order);
  } catch (e: any) {
    Logging.error(e);
    return res
      .status(500)
      .json({ message: "Error retrieving order with user ID", err: e.message });
  }
};

const orderTotalSales = async (req: Request, res: Response) => {
  try {
    const totalSales:any[] = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales) {
      return res
        .status(400)
        .json({ message: "Order total sales cannot be generated" });
    }

    return res.status(200).json({ totalsales: totalSales.pop().totalsales });
  } catch (e: any) {
    Logging.error(e);
    return res
      .status(500)
      .json({ message: "Error retrieving order with user ID", err: e.message });
  }
};

export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deletOrder,
  countOrder,
  getOrderByUserId,
  orderTotalSales,
};
