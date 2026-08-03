import Order from "../model/order.js"
import Product from "../model/product.js"

export async function createOrder(req, res) {
    try {
        if (req.user == null) {
            res.status(401).json({ message: "Unauthorized" })
            return
        }

        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            res.status(400).json({ message: "Order items cannot be empty" })
            return
        }

        const orderData = {
            orderId: "ORD000001",
            firstName: req.body.firstName || req.user.firstName,
            lastName: req.body.lastName || req.user.lastName,
            email: req.user.email,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            phone: req.body.phone,
            items: [],
            totalAmount: 0
        }

        const lastOrder = await Order.findOne().sort({ date: -1 })

        if (lastOrder != null) {
            const lastOrderId = lastOrder.orderId
            const lastOrderNumberInString = lastOrderId.replace("ORD", "")
            const lastOrderNumber = parseInt(lastOrderNumberInString) || 0

            const newOrderNumber = lastOrderNumber + 1
            const newOrderNumberInString = newOrderNumber.toString().padStart(6, "0")
            orderData.orderId = "ORD" + newOrderNumberInString
        }

        for (let i = 0; i < req.body.items.length; i++) {
            const product = await Product.findOne({ productId: req.body.items[i].productId })

            if (product == null) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " not found" })
                return
            }
            if (product.isAvailable === false) {
                res.status(400).json({ message: "Product with id " + req.body.items[i].productId + " is not available" })
                return
            }

            const itemQty = req.body.items[i].quantity || req.body.items[i].qty || 1

            orderData.items.push({
                product: {
                    productId: product.productId,
                    name: product.name,
                    image: (product.images && product.images.length > 0) ? product.images[0] : "",
                    price: product.price,
                    labelledPrice: product.labelledprice ?? product.labelledPrice ?? product.price
                },
                qty: itemQty
            })

            orderData.totalAmount += product.price * itemQty
        }

        const newOrder = new Order(orderData)
        await newOrder.save()

        console.log("Order created with id " + newOrder.orderId)

        res.json({ message: "Order created successfully", orderId: newOrder.orderId })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getAllOrders(req,res){

    if(req.user == null){
        res.status(401).json({message : "Unauthorized"})
        return
    }

    try{

        if(req.user.isAdmin){

            const pageSizeInString = req.params.pageSize||"10"

            const pageNumberInString = req.params.pageNumber||"1"

            const pageSize = parseInt(pageSizeInString) //10

            const pageNumber = parseInt(pageNumberInString) //1

            const orderCount = await Order.countDocuments()

            const totalPages = Math.ceil(orderCount / pageSize)

            const orders = await Order.find().sort({date : -1}).skip((pageNumber-1)*pageSize).limit(pageSize)

            res.json({
                orders : orders,
                totalPages : totalPages,
                totalOrders : orderCount
            })

        }else{

            const pageSizeInString = req.params.pageSize||"10"

            const pageNumberInString = req.params.pageNumber||"1"

            const pageSize = parseInt(pageSizeInString) //10

            const pageNumber = parseInt(pageNumberInString) //1

            const orderCount = await Order.countDocuments({email : req.user.email})

            const totalPages = Math.ceil(orderCount / pageSize)

            const orders = await Order.find({email : req.user.email}).sort({date : -1}).skip((pageNumber-1)*pageSize).limit(pageSize)

            res.json({
                orders : orders,
                totalPages : totalPages,
                currentPage : pageNumber,
                totalOrders : orderCount
            })

        }

    }catch(err){
        res.json({message : err.message})
    }

}

export async function updateOrderStatus(req,res){
    if(req.user == null || req.user.isAdmin == false){
        res.status(401).json({message : "Unauthorized"})
        return
    }

    try{

        const order = await Order.findOne( {orderId : req.params.orderId} )

        if(order == null){
            res.status(404).json({message : "Order not found"})
            return
        }

        await Order.updateOne(
            {orderId : req.params.orderId},
            {status : req.body.status}
        )
        res.json({message : "Order status updated successfully"})

    }catch(err){
        res.json({message : err.message})
    }
}