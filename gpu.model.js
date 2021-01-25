const mongoose = require("mongoose")

const gpuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Debe tener nombre"]
    },
    memory: {
        type: Number,
        required: [true, "Debe tener memoria"]
    },
    image: {
        type: String,
        required: [true, "Debe tener imagen"]
    },
    price: {
        type: Number,
        required: [true, "Debe tener precio"]
    },
    benchmarks: {
        type: Array,
        required: [true, "Debe tener Benchmarks"]
    },
   

})
// Validations for assignedTo employees' size
gpuSchema.path('benchmarks').validate(function (value) {
    if (value.length != 8) {
      throw new Error("8 benchmarks requeridos")
    } else {
        value.forEach(element => {
            if (!Number.isInteger(element)){
                throw new Error("Tienen que ser integers")
            }
        });
    }
  }, 'Benchmark no es valido');
module.exports = mongoose.model("gpucomparator", gpuSchema, 'gpucomparator')