const mongoose = require("mongoose")

const gpuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "a"]
    },
    memory: {
        type: String,
        required: [true, "a"]
    },
    image: {
        type: String,
        required: [true, "a"]
    },
    benchmarks: {
        type: Array,
        required: [true, "a"]
    },
   

})

module.exports = mongoose.model("gpucomparator", gpuSchema, 'gpucomparator')