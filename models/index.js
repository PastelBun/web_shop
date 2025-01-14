const path=require('path');
const fs=require('fs');
const sequelize=require('../util/db')
const models={};

module.exports=(()=>{
    if(!Object.keys(models).length){
        const files= fs.readdirSync(__dirname);
        const excludedfiles=['.','..','index.js'];
    
        for (const fileName of files){
            if(!excludedfiles.includes(fileName)&&(path.extname(fileName)=== '.js')) {
                const modelFile=require(path.join(__dirname, fileName));
                models[modelFile.getTableName()]=modelFile;
            }
        }
        Object
        .values(models)
        .forEach(model=>{
            if(typeof model.associate==='function'){
                model.associate(models);
            }
        });
        models.sequelize=sequelize
    }

    models.User=require('./user')
    models.Product=require('./product')
    models.Cart=require('./cart')
    models.CartItem=require('./cart-item')
    models.Order=require('./order')
    models.OrderItem=require('./order-item')

    models.User.hasMany(models.Product);
    models.Product.belongsTo(models.User, { constraints: true, onDelete: 'CASCADE' });
    models.User.hasOne(models.Cart);
    models.Cart.belongsTo(models.User);
    models.Cart.belongsToMany(models.Product, { through: models.CartItem });
    models.Product.belongsToMany(models.Cart, { through: models.CartItem });
    models.User.hasMany(models.Order);
    models.Order.belongsTo(models.User);
    models.Order.belongsToMany(models.Product, { through: models.OrderItem });
    models.Product.belongsToMany(models.Order, { through: models.OrderItem });
    models.CartItem.belongsTo(models.Cart);
    models.CartItem.belongsTo(models.Product, { foreignKey: 'productId' });
    models.OrderItem.belongsTo(models.Order);
    models.OrderItem.belongsTo(models.Product);
    models.Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
    models.Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
    models.Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
    models.CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });
    models.OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
    models.OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });

    return models;
})();