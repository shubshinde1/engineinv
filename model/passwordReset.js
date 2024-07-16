const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  emp_id: {
    type: mongoose.Schema.Types.ObjectId, //employee model object reference to realtion
    ref: "Employee",
    require: true,
  },
  token: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
