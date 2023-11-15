const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mongoose = require('mongoose');
const product = require('../mappers/product');

module.exports.checkout = async function checkout(ctx, next) {
    if(!ctx.user) {
        return ctx.throw(401, "пользователь не авторизован");
    }
    const {product, phone, address} = ctx.request.body;

    try{
        const order = await Order.create({user: ctx.user._id.toString(), product, phone, address});
        const orderProduct = await Product.findById(product);
        ctx.body = {order: order._id};
        
        sendMail({template: 'order-confirmation', locals: {id: order._id.toString(), product: orderProduct}, to: ctx.user.email, subject: "d"})
    } catch(err) {
        const arrErrors = Object.keys(err.errors).reduce((obj, key) => {
            obj[key]= err.errors[key].message;
            return obj;
        }, {});

        return ctx.throw(400, {message: arrErrors});
    }

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const user = ctx.user._id;
    
    const orders = await Order.find({user});

    ctx.body = { orders };
};
