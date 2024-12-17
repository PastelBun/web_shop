const express=require('express')
const router=express.Router()
const productController=require('../../controllers/admin/product')

router.post('/product/add', (req,res)=>productController.addProduct(req,res))
router.get('/products', (req,res)=>productController.getAllProducts(req,res))
router.get('/product/:id', (req, res)=>productController.getProductById(req,res))
router.post('/product/edit/:id', (req, res)=>productController.editProduct(req,res))
router.delete('/product/delete/:id', (req,res)=>productController.deleteProduct(req, res))

module.exports=router