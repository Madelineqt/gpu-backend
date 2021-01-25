const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, "Debe tener nombre"]
    },
    password: {
        type: String,
        required: [true, "Debe tener contraseña"]
    }
   

})
// Validations for assignedTo employees' size

userSchema.pre(
    'save',
    async function(next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next();
    }
  );
userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }
  
module.exports = mongoose.model("users", userSchema, 'users')