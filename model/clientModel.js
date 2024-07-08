const mongoose = require("mongoose");
const mongoSequence = require("mongoose-sequence");

const clientSchema = new mongoose.Schema(
  {
    clientname: {
      type: String,
      require: true,
    },
    companyname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    linkedinurl: {
      type: String,
    },
    officeaddress: {
      type: String,
    },
    paymentcycle: {
      type: String,
    },
    industry: {
      type: String,
    },
    timezone: {
      type: String,
    },
    primarytechnology: {
      type: String,
    },
    futurepotential: {
      type: String,
    },
    agreementduration: {
      type: String,
    },
    description: {
      type: String,
    },
    gstno: {
      type: String,
    },
    status: {
      type: Number,
      default: 1, // 1 = active, 0 = inactive
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.plugin(mongoSequence(mongoose), { inc_field: "clientid" });

module.exports = mongoose.model("Client", clientSchema);
