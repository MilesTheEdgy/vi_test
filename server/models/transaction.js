const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    name: String,
    amount: Number,
    total: {type: mongoose.Types.Decimal128},
    balanceAfter: {type: mongoose.Types.Decimal128}
})

const TransactionModel = mongoose.model("Transaction", new Schema({
    transaction_id: {
        type: Number,
        required: true
    },
    application_id: {
        type: Number,
        required: true
    },
    product: {
        name: String,
        barcode: Number
    },
    unit_price: {type: Number},
    seller: {
        name: String,
        amount: Number,
        total: {type: mongoose.Types.Decimal128},
        balanceAfter: {type: mongoose.Types.Decimal128}
    },
    buyers: [buyerSchema],
    date: {
        type: Date,
        default: Date.now()
    }
}))

module.exports = TransactionModel