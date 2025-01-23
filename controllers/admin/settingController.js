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



module.exports = {
  updateTimesheetLimit,
  getTimesheetLimit,
};
