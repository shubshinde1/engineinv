const Client = require("../../model/clientModel");
// const Employee = require("../../model/employeeModel");
const Project = require("../../model/projectModel");

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
      country,
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
      country,
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
      country,
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
          country,
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
      ClientData = await Client.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(id) }, // Match the specific client if 'id' is provided
        },
        {
          $lookup: {
            from: "projects", // The name of your Project collection (in plural form)
            localField: "_id", // Local field in Client collection (Client _id)
            foreignField: "clientid", // Foreign field in Project collection (clientid)
            as: "projects", // Alias for the array of matching projects
          },
        },
        {
          $addFields: {
            noOfActiveProjects: {
              $size: {
                $filter: {
                  input: "$projects", // Array of projects
                  as: "project", // Alias for each project
                  cond: { $eq: ["$$project.isdeleted", false] }, // Condition to filter active projects
                },
              },
            },
          },
        },
        {
          $project: {
            clientname: 1,
            companyname: 1,
            email: 1,
            phone: 1,
            status: 1,
            country: 1,
            industry: 1,
            createdAt: 1,
            updatedAt: 1,
            clientid: 1,
            officeaddress: 1,
            isdeleted: 1,
            projectCount: { $size: "$projects" }, // Total number of projects
            noOfActiveProjects: 1, // Number of active projects
          },
        },
      ]);

      if (ClientData.length === 0) {
        return res.status(404).json({
          success: false,
          msg: "Client not found",
        });
      }
    } else {
      ClientData = await Client.aggregate([
        {
          $lookup: {
            from: "projects", // The name of your Project collection (in plural form)
            localField: "_id", // Local field in Client collection (Client _id)
            foreignField: "clientid", // Foreign field in Project collection (clientid)
            as: "projects", // Alias for the array of matching projects
          },
        },
        {
          $addFields: {
            noOfActiveProjects: {
              $size: {
                $filter: {
                  input: "$projects", // Array of projects
                  as: "project", // Alias for each project
                  cond: { $eq: ["$$project.isdeleted", false] }, // Condition to filter active projects
                },
              },
            },
          },
        },
        {
          $project: {
            clientname: 1,
            companyname: 1,
            email: 1,
            phone: 1,
            status: 1,
            country: 1,
            industry: 1,
            createdAt: 1,
            updatedAt: 1,
            clientid: 1,
            officeaddress: 1,
            isdeleted: 1,
            projectCount: { $size: "$projects" }, // Total number of projects
            noOfActiveProjects: 1, // Number of active projects
          },
        },
      ]);
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

const viewClientById = async (req, res) => {
  try {
    const { clientid } = req.body;

    if (!clientid) {
      return res.status(400).json({
        success: false,
        msg: "Client ID is required",
      });
    }

    // Fetch the client data
    const client = await Client.findOne({ _id: clientid }).lean(); // Use `.lean()` to return a plain JavaScript object

    if (!client) {
      return res.status(404).json({
        success: false,
        msg: "Client not found",
      });
    }

    // Count projects associated with the client ID
    const projectCount = await Project.countDocuments({ clientid });

    // Add projectCount directly to the client object
    client.projectCount = projectCount;

    return res.status(200).json({
      success: true,
      msg: "Client fetched successfully",
      data: client, // Send client object with projectCount directly
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch client data",
      error: error.message,
    });
  }
};

const softDeleteClient = async (req, res) => {
  try {
    const { clientid } = req.body;

    if (!clientid) {
      return res.status(400).json({
        success: false,
        msg: "Client ID is required",
      });
    }

    // Fetch the client data
    const client = await Client.findOne({ _id: clientid }); // Use `.lean()` to return a plain JavaScript object

    if (!client) {
      return res.status(404).json({
        success: false,
        msg: "Client not found",
      });
    }

    if (client.isdeleted) {
      return res.status(400).json({
        success: false,
        msg: "Client is already deleted",
      });
    }

    // Check if the client has active projects
    const activeProject = await Project.find({
      clientid: clientid,
      isdeleted: false,
    });

    if (activeProject.length > 0) {
      return res.status(400).json({
        success: false,
        msg: `There are ${activeProject.length} project associated with this client, Delete that project first`,
      });
    }

    // Set isdeleted = true
    await Client.updateOne({ _id: clientid }, { isdeleted: true });

    res.status(200).json({
      success: true,
      msg: "Client has been soft deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "An error occurred while soft deleting the client",
      error: error.message,
    });
  }
};

module.exports = {
  addClient,
  updateClient,
  viewClient,
  viewClientById,
  softDeleteClient,
};
