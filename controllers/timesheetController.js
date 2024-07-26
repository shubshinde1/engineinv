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
        errors: errors.array().map((err) => err.msg),
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
      task.timesheet_id = timesheet._id;
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
    }
    const savedTimesheet = await timesheet.save();

    await Timesheet.updateOne(
      { _id: savedTimesheet._id },
      {
        $set: {
          "task.$[elem].timesheet_id": savedTimesheet._id,
        },
      },
      {
        arrayFilters: [{ "elem.timesheet_id": null }],
      }
    );

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

// const getTimesheetByDate = async (req, res) => {
//   try {
//     const { employee_id, startDate, endDate } = req.body;

//     if (!employee_id || !startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         msg: "Missing required request body parameters",
//       });
//     }

//     // Fetch timesheet data for the specified date range
//     const timesheets = await Timesheet.find({
//       employee_id,
//       date: { $gte: new Date(startDate), $lte: new Date(endDate) },
//     }).populate("task.project task.timesheet_id"); // Populate project details

//     // Aggregate tasks by date
//     const groupedByDate = timesheets.reduce((acc, timesheet) => {
//       // Ensure date is a Date object
//       const date = new Date(timesheet.date);
//       const formattedDate = date.toISOString().split("T")[0];

//       if (!acc[formattedDate]) {
//         acc[formattedDate] = [];
//       }
//       acc[formattedDate] = acc[formattedDate].concat(timesheet.task);
//       return acc;
//     }, {});

//     return res.status(200).json({
//       success: true,
//       data: groupedByDate,
//     });
//   } catch (error) {
//     console.error("Error fetching timesheet data:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Failed to fetch timesheet data",
//       error: error.message,
//     });
//   }
// };

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
    })
      .populate({
        path: "task.project",
        // select: "projectName", // Adjust the fields to select as needed
      })
      .populate({
        path: "task.timesheet_id",
        select: "_id", // Adjust the fields to select as needed
      });

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

// const deleteTimesheet = async (req, res) => {
//   try {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: "Validation errors",
//         errors: errors.array(),
//       });
//     }

//     const { id } = req.body;

//     const timesheetData = await Timesheet.find({ _id: id });

//     if (!timesheetData) {
//       return res.status(500).json({
//         success: false,
//         msg: "Task id not found to delete timesheet data",
//       });
//     }

//     await Timesheet.findByIdAndDelete({ _id: id });

//     return res.status(200).json({
//       success: true,
//       msg: "Timesheet Deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error saving timesheet:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Failed to add timesheet data",
//       error: error.message,
//     });
//   }
// };

const deleteTimesheet = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array().map((err) => err.msg),
      });
    }

    const { timesheetId, taskId } = req.body;

    // Find the Timesheet document and check if it exists
    const timesheetData = await Timesheet.findOne({ _id: timesheetId });

    if (!timesheetData) {
      return res.status(404).json({
        success: false,
        msg: "Timesheet not found",
      });
    }

    // Remove the specific task from the array
    const result = await Timesheet.updateOne(
      { _id: timesheetId },
      { $pull: { task: { _id: taskId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        msg: "Task not found in the timesheet",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to delete task",
      error: error.message,
    });
  }
};

// const updateTimesheet = async (req, res) => {
//   try {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: "Validation errors",
//         errors: errors.array(),
//       });
//     }

//     const { id, date, taskName, subTaskName, description, duration } = req.body;

//     const timesheetData = await Timesheet.findOne({ _id: id });

//     if (!timesheetData) {
//       return res.status(400).json({
//         success: false,
//         msg: "Task id not found to update timesheet data",
//       });
//     }

//     const updatedTimesheetData = await Timesheet.findByIdAndUpdate(
//       { _id: id },
//       {
//         $set: {
//           taskName,
//           date,
//           subTaskName,
//           description,
//           duration,
//         },
//       },
//       { new: true }
//     ).populate("employee_id");

//     return res.status(200).json({
//       success: true,
//       msg: "Timesheet Updated successfully",
//       data: updatedTimesheetData,
//     });
//   } catch (error) {
//     console.error("Error saving timesheet:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Failed to add timesheet data",
//       error: error.message,
//     });
//   }
// };

const updateTimesheet = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array().map((err) => err.msg),
      });
    }

    const {
      timesheet_id,
      task_id,
      taskName,
      subTaskName,
      description,
      duration,
      remark,
      project,
      date,
    } = req.body;

    // Check if timesheet_id and task_id are provided
    if (!timesheet_id || !task_id) {
      return res.status(400).json({
        success: false,
        msg: "Timesheet ID and Task ID are required",
      });
    }

    // Find the timesheet
    const timesheet = await Timesheet.findById(timesheet_id).populate({
      path: "task.timesheet_id",
      select: "_id", // Adjust the fields to select as needed
    });

    if (!timesheet) {
      return res.status(400).json({
        success: false,
        msg: "Timesheet not found",
      });
    }

    // Log timesheet for debugging
    console.log("Timesheet:", timesheet);

    // Find the index of the task to be updated
    const taskIndex = timesheet.task.findIndex((task) => {
      // Ensure task._id is defined
      if (task._id && task_id) {
        return task._id.toString() === task_id.toString();
      }
      return false;
    });

    // Log task index for debugging
    console.log("Task Index:", taskIndex);

    if (taskIndex === -1) {
      return res.status(400).json({
        success: false,
        msg: "Task not found within the timesheet",
      });
    }

    // Update the task
    timesheet.task[taskIndex] = {
      ...timesheet.task[taskIndex],
      timesheet_id: timesheet._id,
      taskName: taskName || timesheet.task[taskIndex].taskName,
      subTaskName: subTaskName || timesheet.task[taskIndex].subTaskName,
      description: description || timesheet.task[taskIndex].description,
      duration: duration || timesheet.task[taskIndex].duration,
      remark: remark || timesheet.task[taskIndex].remark,
      project: project || timesheet.task[taskIndex].project,
      date: date || date,
    };

    // Optionally update the date of the timesheet
    // if (date) {
    //   timesheet.date = date;
    // }

    // Save the updated timesheet
    const updatedTimesheet = await timesheet.save();

    return res.status(200).json({
      success: true,
      msg: "Timesheet updated successfully",
      data: updatedTimesheet,
    });
  } catch (error) {
    console.error("Error updating timesheet:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to update timesheet",
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
