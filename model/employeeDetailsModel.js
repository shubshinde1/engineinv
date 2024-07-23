const mongoose = require("mongoose");

const employeeDetailsSchema = new mongoose.Schema(
  {
    eid: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Employee",
    },
    dob: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    maritialstatus: {
      type: String,
    },
    bloodgroup: {
      type: String,
    },

    //employeement info schema

    dateofjoining: {
      type: String,
    },
    desiganation: {
      type: String,
    },
    department: {
      type: String,
    },
    reportingto: {
      type: String,
    },
    teamleader: {
      type: String,
    },
    techexperties: {
      type: Array,
    },

    // contact details

    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zipcode: {
      type: Number,
    },

    //emergency contact details

    emergencypersonname: {
      type: String,
    },
    relation: {
      type: String,
    },
    profession: {
      type: String,
    },
    emergencypersonaddress: {
      type: String,
    },
    emergencypersonemail: {
      type: String,
    },
    emergencypersonphone: {
      type: Number,
    },

    // work experience

    jobtitle: {
      type: String,
    },
    companyname: {
      type: String,
    },
    companylinkedinurl: {
      type: String,
    },
    employeementtype: {
      type: String,
    },
    startdate: {
      type: String,
    },
    enddate: {
      type: String,
    },
    description: {
      type: String,
    },

    //documents

    adharcard: {
      type: String,
    },
    pancard: {
      type: String,
    },
    addressproof: {
      type: String,
    },
    electricitybil: {
      type: String,
    },
    previousorgofferlatter: {
      type: String,
    },
    previousorgexperiencelatter: {
      type: String,
    },
    payslip1: {
      type: String,
    },
    payslip2: {
      type: String,
    },
    payslip3: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EmployeeDetail", employeeDetailsSchema);
