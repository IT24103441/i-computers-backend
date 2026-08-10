import express from "express";
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus, cancelOrder, deleteOrder } from "../controllers/orderController.js";

const orderRouter = express.Router()

orderRouter.post("/" , createOrder)
orderRouter.get("/my/:pageNumber/:pageSize", getMyOrders)
orderRouter.get("/:pageNumber/:pageSize" , getAllOrders)
orderRouter.put("/:orderId/cancel", cancelOrder)
orderRouter.put("/:orderId" , updateOrderStatus)
orderRouter.delete("/:orderId", deleteOrder)

export default orderRouter