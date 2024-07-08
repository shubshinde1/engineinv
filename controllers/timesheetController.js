const Timesheet = require("../model/timesheetModel");
const Employee = require("../model/employeeModel");
const { validationResult } = require("express-validator");

const fillTimesheet = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { employee_id, date, taskName, subTaskName, description, duration } =
      req.body;

    const employee = await Employee.findOne({ _id: employee_id });

    if (!employee) {
      return res.status(400).json({
        success: false,
        msg: "Employee not Exist",
      });
    }

    console.log(employee.empid);

    const empid = employee.empid;

    // Create a new TimeSheet document
    const newTimeSheet = new Timesheet({
      // Assuming empid is already populated correctly in req.body
      employee_id,
      empid,
      date,
      taskName,
      subTaskName,
      description,
      duration,
    });

    // Save the TimeSheet document
    const savedTimeSheet = await newTimeSheet.save();

    return res.status(200).json({
      success: true,
      msg: "Timesheet data added successfully",
      data: savedTimeSheet,
    });
  } catch (error) {
    console.error("Error saving timesheet:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to add timesheet data",
      error: error.message,
    });
  }
};

const viewTimesheet = async (req, res) => {
  try {
    const timesheetData = await Timesheet.find({}).populate("employee_id");

    return res.status(200).json({
      success: true,
      msg: "Timesheet Fetched successfully",
      data: timesheetData,
    });
  } catch (error) {
    console.error("Error saving timesheet:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to add timesheet data",
      error: error.message,
    });
  }
};

const deleteTimesheet = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    const timesheetData = await Timesheet.findOne({ _id: id });

    if (!timesheetData) {
      return res.status(500).json({
        success: false,
        msg: "Task id not found to delete timesheet data",
      });
    }

    await Timesheet.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      msg: "Timesheet Deleted successfully",
    });
  } catch (error) {
    console.error("Error saving timesheet:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to add timesheet data",
      error: error.message,
    });
  }
};

const updateTimesheet = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id, date, taskName, subTaskName, description, duration } = req.body;

    const timesheetData = await Timesheet.findOne({ _id: id });

    if (!timesheetData) {
      return res.status(500).json({
        success: false,
        msg: "Task id not found to delete timesheet data",
      });
    }

    const updatedTimesheetData = await Timesheet.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          taskName,
          date,
          subTaskName,
          description,
          duration,
        },
      },
      { new: true }
    ).populate("employee_id");

    return res.status(200).json({
      success: true,
      msg: "Timesheet Updated successfully",
      data: updatedTimesheetData,
    });
  } catch (error) {
    console.error("Error saving timesheet:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to add timesheet data",
      error: error.message,
    });
  }
};

module.exports = {
  fillTimesheet,
  viewTimesheet,
  deleteTimesheet,
  updateTimesheet,
};
