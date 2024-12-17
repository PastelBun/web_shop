const express= require('express');
const bodyParser=require('body-parser');
const sequelize=require('./util/db')

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

sequelize 
    .authenticate()
    .then(()=>{
    console.log('Connection has been established successfully.');
    }) 
    .catch ((error)=> {
    console.error('Unable to connect to the database:', error);
  })

app.get('/', (req,res)=>{
    res.json({message:'web shop app'})
});

app.listen(3000);