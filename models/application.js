const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const joinerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pledge: {
        type: Number,
        required: true
    }
})

const ApplicationModel = mongoose.model("Application", new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_barcode: {
        type: Number,
        required: true
    },
    goal: {
        type: Number,
        required: true
    },
    condition: {
        type: String
    },
    unit_price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    submitter: {
        type: String,
        required: true
    },
    submitter_pledge: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "ON_HOLD"
    },
    joiners: [joinerSchema],
    submit_date: {
        type: Date,
        default: Date.now()
    },
    final_date: {
        type: Date,
        required: true
    },
    status_change_date: {
        type: Date
    },
    transaction_id: {
        type: Number,
        required: true
    },
    application_id: {
        type: Number,
        required: true
    }
}))

module.exports = ApplicationModel