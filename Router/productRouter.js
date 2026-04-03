import express from "express";
import { createProduct,getAllProducts,deleteProduct,updateProduct,getProductById } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct)
productRouter.get("/", getAllProducts)
productRouter.get("/:productid", getProductById)
productRouter.delete("/:productid", deleteProduct)
productRouter.put("/:productid", updateProduct)

export default productRouter;