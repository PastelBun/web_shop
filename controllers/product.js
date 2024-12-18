const Product=require('../models/product')

class productController{

    async getAllProducts(req, res){
        const products=await Product.findAll()
        res.status(201).json({
            products:products
        })
    }

    async getProductById(req, res){
        const product= await Product.findOne({
            where: {
                id:req.params.id
            }})
        res.status(201).json({
            product:product
        })
    }
}

module.exports=new productController()