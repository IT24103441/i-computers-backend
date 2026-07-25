import Product from "../model/product.js";

export async function createProduct(req, res) {
    if(req.user == null ) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if(!req.user.isAdmin) {
        res.status(403).json({ message: "Only admins can create products" });
        return;
    }
    try {
        const productId = req.body.productId || req.body.productID;
        if (!productId) {
            res.status(400).json({ message: "productId is required" });
            return;
        }
        const existingProduct = await Product.findOne({ productId });

        if (existingProduct != null) {
            res.status(400).json({ message: "Product with this ID already exists" });
            return;
        }

        const productData = {
            ...req.body,
            productId: productId,
            labelledprice: req.body.labelledprice !== undefined ? req.body.labelledprice : req.body.labelledPrice
        };
        const product = new Product(productData);
        await product.save();
        res.json({ message: "Product created successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllProducts(req, res) {
    try {
        if(req.user != null && req.user.isAdmin) {
            const products = await Product.find();
            res.json(products);
        } else {
           const products = await Product.find({ isAvailable : true });
           res.json(products);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteProduct(req, res) {
      if(req.user != null && req.user.isAdmin) {
        try {
            const productId = req.params.productId || req.params.productid;
            const product = await Product.findOne({ productId });
            if (product == null) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            await Product.deleteOne({ productId });
            res.json({ message: "Product deleted successfully" });
        }catch (error) {            
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json({ message: "Only admins can delete products" });
        return;
    }
    
}

export async function updateProduct(req, res) {
        if(req.user != null && req.user.isAdmin) {
            try {
                if (req.body.productId != null || req.body.productID != null) {
                    res.status(400).json({ message: "Product ID cannot be updated" });
                    return;
                }
                const productId = req.params.productId || req.params.productid;
                await Product.updateOne({ productId }, req.body);
                res.json({ message: "Product updated successfully" });
            }catch (error) {            
                res.status(500).json({ message: error.message });
            }
        } else {
            res.status(403).json({ message: "Only admins can update products" });
            return;
        }
    
    
}

export async function getProductById(req, res) {
    try {
        const productId = req.params.productId || req.params.productid;
        const product = await Product.findOne({ productId });
        if (product == null) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if(product.isAvailable) {
            res.json(product);
            
        } else {
            if(req.user != null && req.user.isAdmin) {
                res.json(product);
            } else {
                res.status(403).json({ message: "Product is not available" });
                return;
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}
