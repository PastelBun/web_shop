const express= require('express');
//const bodyParser=require('body-parser');
const sequelize=require('./util/db')

const app=express();


const models=require('./models/index');
sequelize.models=models

app.use((req, res, next)=>{
    models.User.findByPk(1)
    .then(user=>{
        req.user=user
        next()
    })
    .catch(err=> console.log(err));
})

app.use(express.json());  // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses form data
//app.use(bodyParser.urlencoded({extended:true}));

const productAdminRoutes=require('./routes/admin/product')
app.use('/admin', productAdminRoutes)
const productRoutes=require('./routes/product')
app.use(productRoutes)
const shopRoutes=require('./routes/shop')
app.use(shopRoutes)
/*
sequelize.query('DROP TABLE IF EXISTS `cart-items`;');
sequelize.query('DROP TABLE IF EXISTS `orders`;');
sequelize.query('DROP TABLE IF EXISTS `orderItems`;');
sequelize.query('DROP TABLE IF EXISTS `products`;');
*/
sequelize 
    .sync(force=true)
    .then(()=>{
    return models.User.findByPk(1)
    }) 
    .then(user=>{
        if(!user){
            return models.User.create({ name:"user", email:"user@local.com"})
        }
        return user;
    })
    .then((user)=>{
        return user.createCart()
    })
    .then((cart)=>{
        console.log(cart)
        app.listen(3000);
    })
    .catch ((error)=> {
    console.error(error);
  })

app.get('/', (req,res)=>{
    res.json({message:'web shop app'})
});

