const Product = require('../models/Product');
const mapProducts = require("../mappers/product");

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query; 
  
  const products = await Product.find({ $text: {$search: query}});

  ctx.body = { products: products.map(mapProducts) };
};
