const Product=require('../models/product')
const CartItem = require('../models/cart-item')
const OrderItem = require('../models/order-item')

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
        await CartItem.create({
            productId: req.params.id,
            quantity:req.body.quantity,
            cartId:req.body.cartId
        })}
        res.status(201).json({
            message:'Product is added to cart',
            id:CartItem.id
        }) 
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
    
    async order(req,res){
        itemsInCart=Cart.getCart();
        if (itemsInCart>0){
            await order.create({
            userId: Cart.userId,
            })
            itemsInCart.array.forEach(element => {
                OrderItem.create({
                    userId:CartItem.userId,
                    cartId:req.params.id,
                    quantity:CartItem.quantity
                }) 
                CartItem.removeFromCart
            });
            res.status(201).json({
                message:'Order has been created'
            })   
        }
        else {res.status(500).json({
            message:'Cart is empty'
        })}
        
    }
}

module.exports=new shopController()