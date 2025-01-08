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

    async getCart(req, res){
        const userCart=await req.user.getCart()
        const cartProducts=await userCart.getProducts()
        res.status(201).json({
            products:cartProducts
        })
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
        const user = req.user; 
        const userCart=await user.getCart();
        const cartProducts=await userCart.getProducts();
        if (cartProducts.length>0){
            const order=await Order.create({userId:user.id});
            for (let cartItem of cartProducts) {
                await OrderItem.create({
                    orderId:order.id,
                    productId:cartItem.productId,
                    quantity:cartItem.quantity
                })
            }
            res.status(200).json({
                message:'Order has been created'
            })
        } else {
            res.status(500).json({
                message:'Cart is empty'
            })
        }
    }
            
    
    async getOrders(req, res) {
        
            const userId =  req.user.id; 

            const orders = await Order.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: Product,
                        through: { attributes: ['productId'] } 
                    }
                ]
            });
            res.status(200).json({
                orders: orders
            });
        } 

}
module.exports=new shopController()