const Client = require("../../model/clientModel");
// const Employee = require("../../model/employeeModel");

const { validationResult } = require("express-validator");

const addClient = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      clientname,
      companyname,
      email,
      phone,
      linkedinurl,
      officeaddress,
      paymentcycle,
      industry,
      timezone,
      primarytechnology,
      futurepotential,
      agreementduration,
      description,
      gstno,
      status,
    } = req.body;

    const isExist = await Client.findOne({ email });

    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Client is Already Exist",
      });
    }

    const newClientData = new Client({
      clientname,
      companyname,
      email,
      phone,
      linkedinurl,
      officeaddress,
      paymentcycle,
      industry,
      timezone,
      primarytechnology,
      futurepotential,
      agreementduration,
      description,
      gstno,
      status,
    });

    const clientData = await newClientData.save();
    return res.status(200).json({
      success: true,
      msg: "Client Added Successfully",
      data: clientData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      id,
      clientname,
      companyname,
      email,
      phone,
      linkedinurl,
      officeaddress,
      paymentcycle,
      industry,
      timezone,
      primarytechnology,
      futurepotential,
      agreementduration,
      description,
      gstno,
      status,
    } = req.body;

    const isExist = await Client.findOne({ _id: id });

    if (!isExist) {
      return res.status(400).json({
        success: false,
        msg: "Client is not Exist",
      });
    }

    const updateClientData = await Client.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          clientname,
          companyname,
          email,
          phone,
          linkedinurl,
          officeaddress,
          paymentcycle,
          industry,
          timezone,
          primarytechnology,
          futurepotential,
          agreementduration,
          description,
          gstno,
          status,
        },
      },
      { new: true }
    );

    // const clientData = await updateClientData.save();
    return res.status(200).json({
      success: true,
      msg: "Client Updated Successfully",
      data: updateClientData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const viewClient = async (req, res) => {
  try {
    const { id } = req.body;

    let ClientData;
    if (id) {
      ClientData = await Client.findById({ _id: id });
      if (!ClientData) {
        return res.status(404).json({
          success: false,
          msg: "Client not found",
        });
      }
    } else {
      ClientData = await Client.find({});
    }

    return res.status(200).json({
      success: true,
      msg: "Client Data Fetched successfully",
      data: ClientData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { addClient, updateClient, viewClient };
