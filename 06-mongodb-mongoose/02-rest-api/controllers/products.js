const Product = require("../models/Product");
const mapProduct = require("../mappers/product");
const { default: mongoose } = require("mongoose");

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return await next();

  if(!mongoose.isValidObjectId(subcategory)) ctx.throw(400, 'invalid id subcategory');

  const products = await Product.find({ subcategory });
  
  ctx.body = { products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const idProduct = ctx.params.id;

  if(!mongoose.isValidObjectId(idProduct)) ctx.throw(400, 'invalid id product')

  const product = await Product.findById(idProduct);
  if(!product) ctx.throw(404, 'product not found');
  
  ctx.body = { product: mapProduct(product)};
};

