const Setting = require("../../model/settingsModel");

const updateTimesheetLimit = async (req, res) => {
  try {
    const { addtimesheetlimit, updatetimesheetlimit, deletetimesheetlimit } =
      req.body;

    const updateFields = {};
    if (addtimesheetlimit !== undefined)
      updateFields.addtimesheetlimit = addtimesheetlimit;
    if (updatetimesheetlimit !== undefined)
      updateFields.updatetimesheetlimit = updatetimesheetlimit;
    if (deletetimesheetlimit !== undefined)
      updateFields.deletetimesheetlimit = deletetimesheetlimit;

    // Find the settings document and update
    const updatedSetting = await Setting.findOneAndUpdate(
      {}, // Finds the first document (adjust filter if needed)
      { $set: updateFields }, // Dynamically updates the provided fields
      { new: true, upsert: true } // Returns the updated document and creates one if it doesn't exist
    );

    return res.status(200).json({
      success: true,
      msg: "timesheetlimit updated successfully.",
      data: updatedSetting,
    });
  } catch (error) {
    console.error("Error updating timesheetlimit:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while updating timesheetlimit.",
    });
  }
};

const getTimesheetLimit = async (req, res) => {
  try {
    const timesheetlimit = await Setting.findOne({});
    return res.status(200).json({
      success: true,
      msg: "timesheetlimit fetched successfully.",
      data: timesheetlimit,
    });
  } catch (error) {
    console.error("Error fetching timesheetlimit:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while fetching timesheetlimit.",
    });
  }
};

module.exports = {
  updateTimesheetLimit,
  getTimesheetLimit,
};
