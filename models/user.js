const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserModel = mongoose.model("User", new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    pharmacy_name: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now()
    },
    balance: {
        type: mongoose.Types.Decimal128,
        default: 0
    }
}))

module.exports = UserModel