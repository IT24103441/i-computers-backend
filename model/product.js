import mongoose, { model } from "mongoose";

const productSchema = new mongoose.Schema(
        {
                productId: {
                        type: String,
                        required: true,
                        unique: true
                },

                name: {
                        type: String,
                        required: true
                },

                altNames: {
                        type: [String],
                        default: [],
                        required: true
                },

                description: {
                        type: String,
                        required: true
                },

                price: {
                        type: Number,
                        required: true
                },

                labelledprice: {
                        type: Number,
                        required: true
                },

                images: {
                        type: [String],
                        required: true,
                        default: ["/default-product-1.png", "/default-product-2.png"]
                },

                isAvailable: {
                        type: Boolean,
                        default: true,
                        required: true
                },
                category: {
                        type: String,
                        required: false

                },
                stock: {
                        type: Number,
                        default: 0,
                        required: true
                },
                brand: {
                        type: String,
                        required: false
                },
                model: {
                        type: String,
                        required: false
                },
        }
)

const Product = mongoose.model("Products", productSchema);

export default Product;