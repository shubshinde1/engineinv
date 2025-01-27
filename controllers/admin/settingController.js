const Setting = require("../../model/settingsModel");

// timesheet
const updateTimesheetLimit = async (req, res) => {
  try {
    const { addtimesheetlimit, updatetimesheetlimit, deletetimesheetlimit } = req.body;

    const updateFields = {};
    if (addtimesheetlimit !== undefined) updateFields["timesheet.addtimesheetlimit"] = addtimesheetlimit;
    if (updatetimesheetlimit !== undefined) updateFields["timesheet.updatetimesheetlimit"] = updatetimesheetlimit;
    if (deletetimesheetlimit !== undefined) updateFields["timesheet.deletetimesheetlimit"] = deletetimesheetlimit;

    // Find the settings document and update
    const updatedSetting = await Setting.findOneAndUpdate(
      {}, // Finds the first document (adjust filter if needed)
      { $set: updateFields }, // Dynamically updates the provided fields
      { new: true, upsert: true } // Returns the updated document and creates one if it doesn't exist
    );

    return res.status(200).json({
      success: true,
      msg: "Timesheet limits updated successfully.",
      data: updatedSetting,
    });
  } catch (error) {
    console.error("Error updating timesheet limits:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while updating timesheet limits.",
    });
  }
};

const getTimesheetLimit = async (req, res) => {
  try {
    const timesheetLimit = await Setting.findOne({}, "timesheet");
    return res.status(200).json({
      success: true,
      msg: "Timesheet limits fetched successfully.",
      data: timesheetLimit?.timesheet || {},
    });
  } catch (error) {
    console.error("Error fetching timesheet limits:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching timesheet limits.",
    });
  }
};


// department
const addDepartment = async (req, res) => {
  try {
    const { departments } = req.body;
    if (!departments || !Array.isArray(departments)) {
      return res.status(400).json({
        success: false,
        msg: "Departments array is required.",
      });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $addToSet: { department: { $each: departments } } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Departments added successfully.",
      data: updatedSetting.department,
    });
  } catch (error) {
    console.error("Error adding departments:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while adding departments.",
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const settings = await Setting.findOne({}, "department");
    return res.status(200).json({
      success: true,
      msg: "Departments fetched successfully.",
      data: settings?.department || [],
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching departments.",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { departments } = req.body;
    if (!departments || !Array.isArray(departments)) {
      return res.status(400).json({
        success: false,
        msg: "Departments array is required.",
      });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $pull: { department: { $in: departments } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Departments deleted successfully.",
      data: updatedSetting.department,
    });
  } catch (error) {
    console.error("Error deleting departments:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while deleting departments.",
    });
  }
};


// country
const addCountry = async (req, res) => {
  try {
    const { countries } = req.body;
    if (!countries || !Array.isArray(countries)) {
      return res.status(400).json({
        success: false,
        msg: "Countries array is required.",
      });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $addToSet: { country: { $each: countries } } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Countries added successfully.",
      data: updatedSetting.country,
    });
  } catch (error) {
    console.error("Error adding countries:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while adding countries.",
    });
  }
};

const getCountries = async (req, res) => {
  try {
    const settings = await Setting.findOne({}, "country");
    return res.status(200).json({
      success: true,
      msg: "Countries fetched successfully.",
      data: settings?.country || [],
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching countries.",
    });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { countries } = req.body;
    if (!countries || !Array.isArray(countries)) {
      return res.status(400).json({
        success: false,
        msg: "Countries array is required.",
      });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $pull: { country: { $in: countries } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Countries deleted successfully.",
      data: updatedSetting.country,
    });
  } catch (error) {
    console.error("Error deleting countries:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while deleting countries.",
    });
  }
};


//ReportingTo
const addReportingTo = async (req, res) => {
  try {
    const { reportingTo } = req.body;
    if (!reportingTo || !Array.isArray(reportingTo)) {
      return res.status(400).json({
        success: false,
        msg: "ReportingTo array is required.",
      });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $addToSet: { reportingTo: { $each: reportingTo } } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      msg: "ReportingTo added successfully.",
      data: updatedSetting.reportingTo,
    });
  } catch (error) {
    console.error("Error adding ReportingTo:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while adding ReportingTo.",
    });
  }
};

const getReportingTo = async (req, res) => {
  try {
    const settings = await Setting.findOne({}, "reportingTo");
    return res.status(200).json({
      success: true,
      msg: "ReportingTo fetched successfully.",
      data: settings?.reportingTo || [],
    });
  } catch (error) {
    console.error("Error fetching ReportingTo:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching ReportingTo.",
    });
  }
};

const deleteReportingTo = async (req, res) => {
  try {
    const { reportingTo } = req.body;
    if (!reportingTo || !Array.isArray(reportingTo)) {
      return res.status(400).json({
        success: false,
        msg: "ReportingTo array is required.",
      });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $pull: { reportingTo: { $in: reportingTo } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "ReportingTo deleted successfully.",
      data: updatedSetting.reportingTo,
    });
  } catch (error) {
    console.error("Error deleting ReportingTo:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while deleting ReportingTo.",
    });
  }
};


// Designation
const getDesignations = async (req, res) => {
  try {
    const settings = await Setting.findOne({}, "designation");
    return res.status(200).json({
      success: true,
      msg: "Designations fetched successfully.",
      data: settings?.designation || [],
    });
  } catch (error) {
    console.error("Error fetching designations:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching designations.",
    });
  }
};

const addDesignation = async (req, res) => {
  try {
    const { designation } = req.body;
    if (!designation || typeof designation !== 'string') {
      return res.status(400).json({
        success: false,
        msg: "Designation string is required.",
      });
    }

    // Use $addToSet to ensure the designation is unique (no duplicates)
    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $addToSet: { designation: designation } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Designation added successfully.",
      data: updatedSetting.designation,
    });
  } catch (error) {
    console.error("Error adding designation:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while adding the designation.",
    });
  }
};


const deleteDesignation = async (req, res) => {
  try {
    const { designations } = req.body; // Expecting an array of designations
    if (!designations || !Array.isArray(designations)) {
      return res.status(400).json({
        success: false,
        msg: "Designations array is required.",
      });
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $pull: { designation: { $in: designations } } }, // Pull all designations from the array
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Designations deleted successfully.",
      data: updatedSetting.designation,
    });
  } catch (error) {
    console.error("Error deleting designations:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while deleting designations.",
    });
  }
};

const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    return res.status(200).json({
      success: true,
      msg: "Settings fetched successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching settings.",
    });
  }
};




module.exports = {
  updateTimesheetLimit,
  getTimesheetLimit,
  addDepartment,
  getDepartments,
  deleteDepartment,
  addCountry,
  getCountries,
  deleteCountry,
  addReportingTo,
  getReportingTo,
  deleteReportingTo,
  getDesignations,
  addDesignation,
  deleteDesignation,
  getAllSettings
};
