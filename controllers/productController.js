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
        const existingProduct = await Product.findOne({ productID: req.body.productID });

        if (existingProduct != null) {
            res.status(400).json({ message: "Product with this ID already exists" });
            return;
        }

        const product = new Product(req.body);
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
            const product = await Product.findOne({ productid: req.params.productid });
            if (product == null) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            await Product.deleteOne({ productid: req.params.productid });
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
                if(req.body.productID != null) {
                    res.status(400).json({ message: "Product ID cannot be updated" });
                    return;
                }
                await Product.updateOne({ productid: req.params.productid }, req.body);
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
        const product = await Product.findOne({ productid: req.params.productid });
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
