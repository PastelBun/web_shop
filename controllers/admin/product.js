const Product=require('../../models/product')

class adminController{
    async addProduct(req,res){
        console.log(req.body);  // Check if the request body is correct
        const product=await Product.create({
            title: req.body.title,
            price:req.body.price,
            imageUrl:req.body.imageUrl,
            description:req.body.description,
            userId:req.user.id
        })
        res.status(201).json({
            message:'Product is added',
            productId:product.id
        })
    }

    async getAllProducts(req, res){
        const products=await Product.findAll()
        console.log(products)
        res.status(201).json({
            products:products
        })
    }

    async getProductById(req, res){
        const product= await Product.findOne({
            where: {
                id:req.params.id
            }})
        console.log(product)
        res.status(201).json({
            product:product
        })
    }

    async editProduct(req,res){
        const id=parseInt(req.params.id)
        let title=req.body.title
        let price=req.body.price
        let imageUrl=req.body.imageUrl
        let description=req.body.description
        
        const newProduct=Product.update({
            title:title,
            price:price,
            imageUrl:imageUrl,
            description:description,
        },
        {
            where: { id:id },
        })
        .then(product=>{
            console.log(product)
            return res.status(200).json({ message: "Product updated"});
        })
        .catch (error=>{
            return res.status(500).send(error.message);
        })

    }

    async deleteProduct(req,res){
        const id=parseInt(req.params.id)

        const deletedProduct=Product.destroy({
           where: {id:id} 
        })
        .then(deletedCount=>{
            if (deletedCount>0){
            return res.status(200).json({ message: `Product deleted`});
        }})
        .catch (error=>{
            return res.status(500).send(error.message);
        })
    }
}

module.exports=new adminController()