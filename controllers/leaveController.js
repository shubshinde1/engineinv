const leavebalance = require("../model/leaveBalanceModel");
const { validationResult } = require("express-validator");

const getLeaveDetails = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array().map((err) => err.msg),
      });
    }

    const { employee_id } = req.body;

    // Validate that employee_id is provided
    if (!employee_id) {
      return res.status(400).json({
        success: false,
        msg: "Employee ID is required",
      });
    }

    // Find the leave balance record for the specified employee_id
    const leaveRecord = await leavebalance
      .findOne({ employee_id })
      .populate("employee_id", "_id");

    // Check if a record was found
    if (!leaveRecord) {
      return res.status(404).json({
        success: false,
        msg: `No leave records found for employee_id: ${employee_id}`,
      });
    }

    // Create a response structure with the holidays
    const holidays = {
      employee_id: leaveRecord.employee_id,
      leaves: leaveRecord.leaves,
      optionalholiday: leaveRecord.optionalholiday,
      mandatoryholiday: leaveRecord.mandatoryholiday,
      weekendHoliday: leaveRecord.weekendHoliday,
    };

    res.status(200).json({
      success: true,
      holidays: holidays,
    });
  } catch (error) {
    console.error("Error viewing holidays:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getLeaveDetails,
};
