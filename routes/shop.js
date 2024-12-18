const express=require('express')
const router=express.Router()
const shopController= require('../controllers/shop')

router.get('/cart', (req,res)=>shopController.getCart(req,res))
router.post('/cart/add/:id',(req,res)=>shopController.addToCart(req,res))
router.post('/cart/delete/:id', (req, res)=>shopController.removeFromCart(req,res))
router.post('/cart/order', (req,res)=>shopController.order(req,res))

module.exports=router