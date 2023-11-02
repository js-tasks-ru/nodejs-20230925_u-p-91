const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
});

const subcategoriesModel = connection.model('Subcategorie', subCategorySchema);

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },      
    subcategories: [subCategorySchema],
    // subcategories: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Subcategorie'
    // }]
});

module.exports = connection.model('Category', categorySchema);
