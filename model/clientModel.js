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
    officeaddress: {
      type: String,
    },
    linkedinurl: {
      type: String,
    },
    paymentcycle: {
      type: String,
    },
    industry: {
      type: String,
    },
    country: {
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
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.plugin(mongoSequence(mongoose), { inc_field: "clientid" });

module.exports = mongoose.model("Client", clientSchema);
