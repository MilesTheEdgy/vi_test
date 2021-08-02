const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ProductModel = mongoose.model("Product", new Schema({
    Product_name: {
        type: String
    },
    Barcode: {
        type: String,
    },
    ATC_code: {
        type: String
    },
    type: {
        type: String
    }
}))

module.exports = ProductModel