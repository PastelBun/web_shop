const Product=require('../models/product')
const CartItem = require('../models/cart-item')
const OrderItem = require('../models/order-item')
const Cart=require("../models/cart")
const Order=require('../models/order')

class shopController{
    async getAllProducts(req, res){
        const products=await Product.findAll()
        res.status(201).json({
            products:products
        })
    }

    /*async getCart(req, res){
        const userCart=await req.user.getCart()
        const cartProducts=await userCart.getProducts()
        res.status(201).json({
            products:cartProducts
        })
    }*/
        async getCart(req, res) {
            const userCart = await req.user.getCart();
            const cartProducts = await userCart.getProducts({
                through: {
                    attributes: ['quantity']  // Ensure quantity from CartItem is included
                }
            });
        
            res.status(201).json({
                products: cartProducts
            });
        }
        
    async addToCart(req,res){
        const cartId=req.body.cartId
        const productId= req.params.id
        const quantity=req.body.quantity

        const existingCartItem = await CartItem.findOne({
            where: {
                cartId: cartId,
                productId: productId,
            }
        });

        if(existingCartItem){
            existingCartItem.quantity = quantity;
            await existingCartItem.save();
            return res.status(200).json({
            message: 'Product quantity updated in cart',
            id: existingCartItem.id
        });}
        else{
            const newCartItem = await CartItem.create({
                productId: req.params.id,
                quantity: req.body.quantity,
                cartId: req.body.cartId
            });
            return res.status(201).json({
                message: 'Product is added to cart',
                id: newCartItem.id
        })}
    }    
    async removeFromCart(req,res){
        await CartItem.destroy({
            where: {
            cartId:req.body.cartId,
            productId: req.body.productId,
            id: req.params.id
            },
        })
        res.status(201).json({
            message:'Product is removed from cart'
        }) 
    }
    
    
    async order(req, res) {
        const user = req.user || req.body.user; // Get the authenticated user
        try {
            // Get the cart of the user
            const userCart = await user.getCart();
            const cartProducts = await userCart.getProducts({
                through: {
                    attributes: ['quantity']  // Include quantity from CartItem
                }
            });
    
            // Check if the cart is empty
            if (cartProducts.length > 0) {
                // Create a new order
                const order = await Order.create({ userId: user.id });
    
                for (let cartItem of cartProducts) {
                    console.log(cartItem);
                    console.log('CartItem Product ID:', cartItem.productId);

                    const quantity = cartItem.cartItem.quantity; // Access the quantity correctly
                    if (quantity) {
                        // Add product and quantity to the order
                        await OrderItem.create({
                            orderId: order.id,
                            productId: cartItem.cartItem.productId,
                            quantity: quantity  // Add the quantity from CartItem
                        });
    
                        // After creating the OrderItem, remove the cart item
                        await CartItem.destroy({
                            where: {
                                id: cartItem.cartItem.id // Use the CartItem ID to destroy it
                            }
                        });
                    } else {
                        // If no quantity is found, handle it appropriately (optional)
                        console.error(`No quantity found for product: ${cartItem.productId}`);
                    }
                }
    
                // Respond with a success message
                res.status(200).json({
                    message: 'Order has been created successfully.'
                });
            } else {
                // Cart is empty
                res.status(400).json({
                    message: 'Cart is empty'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
    
                
    async getOrders(req, res) {
        
            const userId =  req.user.id; 

            const orders = await Order.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: Product,
                        through: { attributes: ['quantity'] } 
                    }
                ]
            });
            res.status(200).json({
                orders: orders
            });
        } 

}
module.exports=new shopController()