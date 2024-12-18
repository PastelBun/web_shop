const express=require('express')
const router=express.Router()
const shopController= require('../controllers/shop')

router.get('/cart', (req,res)=>shopController.getCart(req,res))
router.post('/cart/add/:id',(req,res)=>shopController.addToCart(req,res))
router.post('/cart/delete/:id', (req, res)=>shopController.removeFromCart(req,res))
//router.post('/cart/change', (req, res)=>shopController.changeQuantity(req,res))

module.exports=router