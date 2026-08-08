import express from "express";
import { createProduct,getAllProducts,deleteProduct,updateProduct,getProductById,searchProducts, } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct)
productRouter.get("/", getAllProducts)
productRouter.get("/:productid", getProductById)
productRouter.delete("/:productid", deleteProduct)
productRouter.put("/:productid", updateProduct)
productRouter.get("/search/:query",searchProducts)

export default productRouter;