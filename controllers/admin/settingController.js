const Setting = require("../../model/settingsModel");

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

const updateSettingField = async (req, res) => {
  try {
    const { field, value } = req.body; // Expect { field: 'department', value: ['IT', 'HR'] }

    // Check if the field is valid
    const validFields = ['department', 'country', 'reportingTo', 'designation'];
    if (!validFields.includes(field)) {
      return res.status(400).json({
        success: false,
        msg: `Invalid field. Allowed fields are: ${validFields.join(', ')}`,
      });
    }

    // Find and update the specific field
    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $set: { [`${field}`]: value } }, // Dynamically update the field
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      msg: `${field} updated successfully.`,
      data: updatedSetting,
    });
  } catch (error) {
    console.error("Error updating setting field:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while updating setting field.",
    });
  }
};

// Get settings for a specific field (department, country, reportingTo, designation)
const getSettingField = async (req, res) => {
  try {
    const { field } = req.params; // Expected in URL: /settings/:field

    // Check if the field is valid
    const validFields = ['department', 'country', 'reportingTo', 'designation'];
    if (!validFields.includes(field)) {
      return res.status(400).json({
        success: false,
        msg: `Invalid field. Allowed fields are: ${validFields.join(', ')}`,
      });
    }

    const setting = await Setting.findOne({}, field); // Retrieve the specific field
    return res.status(200).json({
      success: true,
      msg: `${field} fetched successfully.`,
      data: setting ? setting[field] : [],
    });
  } catch (error) {
    console.error("Error fetching setting field:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching setting field.",
    });
  }
};

// Delete a specific item from department, country, reportingTo, or designation
const deleteSettingItem = async (req, res) => {
  try {
    const { field, item } = req.body; // Expected { field: 'department', item: 'HR' }

    // Check if the field is valid
    const validFields = ['department', 'country', 'reportingTo', 'designation'];
    if (!validFields.includes(field)) {
      return res.status(400).json({
        success: false,
        msg: `Invalid field. Allowed fields are: ${validFields.join(', ')}`,
      });
    }

    // Dynamically remove the item from the array field
    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { $pull: { [field]: item } }, // Removes the item from the field array
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: `Item removed from ${field} successfully.`,
      data: updatedSetting,
    });
  } catch (error) {
    console.error("Error deleting setting item:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while deleting setting item.",
    });
  }
};



module.exports = {
  updateTimesheetLimit,
  getTimesheetLimit,
  updateSettingField,
  getSettingField,
  deleteSettingItem
};
