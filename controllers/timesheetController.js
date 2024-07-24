const Timesheet = require("../model/timesheetModel");
const Employee = require("../model/employeeModel");
const { validationResult } = require("express-validator");
const Project = require("../model/projectModel");

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

    const {
      employee_id,
      date,
      taskName,
      subTaskName,
      description,
      duration,
      remark,
      project,
    } = req.body;

    const employee = await Employee.findOne({ _id: employee_id });
    const projectdetails = await Project.findOne({ _id: project });

    if (!employee) {
      return res.status(400).json({
        success: false,
        msg: "Employee does not exist",
      });
    }
    if (!projectdetails) {
      return res.status(400).json({
        success: false,
        msg: "Project does not exist",
      });
    }

    const empid = employee.empid;

    // Check if a timesheet entry for the given date already exists
    let timesheet = await Timesheet.findOne({ employee_id, date });

    const task = {
      taskName,
      subTaskName,
      description,
      duration,
      remark, // Ensure remark is included here
      project: projectdetails._id, // Store only the reference ID
    };

    if (timesheet) {
      // If it exists, update the tasks array
      timesheet.task.push(task);
      await timesheet.save();
    } else {
      // If it does not exist, create a new timesheet document
      timesheet = new Timesheet({
        employee_id,
        empid,
        date,
        task: [task],
      });
      await timesheet.save();
    }

    return res.status(200).json({
      success: true,
      msg: "Timesheet data added successfully",
      data: timesheet,
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

const getTimesheetByDate = async (req, res) => {
  try {
    const { employee_id, startDate, endDate } = req.body;

    if (!employee_id || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        msg: "Missing required request body parameters",
      });
    }

    // Fetch timesheet data for the specified date range
    const timesheets = await Timesheet.find({
      employee_id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate("task.project"); // Populate project details

    // Aggregate tasks by date
    const groupedByDate = timesheets.reduce((acc, timesheet) => {
      // Ensure date is a Date object
      const date = new Date(timesheet.date);
      const formattedDate = date.toISOString().split("T")[0];

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate] = acc[formattedDate].concat(timesheet.task);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: groupedByDate,
    });
  } catch (error) {
    console.error("Error fetching timesheet data:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch timesheet data",
      error: error.message,
    });
  }
};

const viewTimesheet = async (req, res) => {
  try {
    const timesheetData = await Timesheet.find({}).populate(
      "employee_id task.project"
    );
    // .populate("project");

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

const getProjectDetails = async (req, res) => {
  try {
    const projectData = await Project.find({});

    return res.status(200).json({
      success: true,
      msg: "Timesheet Fetched successfully",
      data: projectData,
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
  getTimesheetByDate,
  viewTimesheet,
  deleteTimesheet,
  updateTimesheet,
  getProjectDetails,
};
