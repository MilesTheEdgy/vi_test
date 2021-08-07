const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CounterModel = mongoose.model("Counter", new Schema({
    sequenceName: {
        type: String,
        unique: true
    },
    value: {
        type: Number,
    }
}))

module.exports = CounterModel