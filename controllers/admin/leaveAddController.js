const { validationResult } = require("express-validator");
const leavebalance = require("../../model/leaveBalanceModel");
const Employee = require("../../model/employeeModel");

const EXCLUDE_ID = "6687d8abecc0bcb379e20227"; // Admin _id exclude

const addLeaves = async (req, res) => {
  try {
    // Get all employee data from the Employee model
    const employees = await Employee.find().select("_id dateofjoining");

    const desiredYear = 2025;

    const currentDate = new Date();
    // currentDate.setFullYear(desiredYear);
    console.log(currentDate.toDateString());
    const currentYear = currentDate.getFullYear();
    const endOfMarch = new Date(currentYear, 2, 31); // March 31 of the current year
    const nextEndOfMarch = new Date(currentYear + 1, 2, 31); // March 31 of the next year

    // Helper function to calculate total leaves based on probation end date
    const calculateLeaves = (probationEndDate) => {
      // Calculate the number of months from the probation end date to the next March 31
      const monthsUntilMarch = Math.max(
        0,
        (nextEndOfMarch - probationEndDate) / (1000 * 60 * 60 * 24 * 30) // Approximate number of months
      );
      return monthsUntilMarch * 1.5; // 1.5 leaves per month
    };

    // Helper function to round leaves to nearest 0.5
    const roundToNearestHalf = (value) => {
      return Math.round(value * 2) / 2;
    };

    // Filter out the employee with the specific _id
    const filteredEmployees = employees.filter(
      (employee) => employee._id.toString() !== EXCLUDE_ID
    );

    // Process each employee
    await Promise.all(
      filteredEmployees.map(async (employee) => {
        const employee_id = employee._id;
        const dateOfJoining = new Date(employee.dateofjoining);
        const probationEndDate = new Date(dateOfJoining);
        probationEndDate.setMonth(probationEndDate.getMonth() + 6);

        // Calculate total leaves based on the probation end date
        let totalLeaves = 0;
        try {
          if (probationEndDate < endOfMarch) {
            // If probation end date is before March 31 of the current year
            totalLeaves = 18;
          } else {
            // Calculate leaves based on months until the next March 31
            totalLeaves = calculateLeaves(probationEndDate);
            if (isNaN(totalLeaves)) {
              throw new Error("Invalid leave calculation");
            }
          }
          // Ensure totalLeaves does not exceed 18 and round to the nearest 0.5
          totalLeaves = Math.min(totalLeaves, 18);
          totalLeaves = roundToNearestHalf(totalLeaves);
        } catch (error) {
          console.error(
            `Error calculating leaves for employee _id: ${employee_id}:`,
            error.message
          );
          totalLeaves = 0; // Fallback to 0 leaves if calculation fails
        }

        // Find or create leave record
        let leaveRecord = await leavebalance.findOne({ employee_id });

        if (leaveRecord) {
          if (leaveRecord.leaves.total != null) {
            // Skip employees who already have a leave record with a total not null
            console.log(
              `Employee _id: ${employee_id} probationEndDate: ${probationEndDate}, already has leaves: ${leaveRecord.leaves.total}`
            );
            return;
          } else {
            // Update existing leave record for employees with total = null
            leaveRecord.leaves.total = totalLeaves;
            leaveRecord.leaves.available =
              totalLeaves - (leaveRecord.leaves.consume || 0);
            if (
              isNaN(leaveRecord.leaves.total) ||
              isNaN(leaveRecord.leaves.available)
            ) {
              throw new Error("Invalid leave values");
            }
            await leaveRecord.save();
          }
        } else {
          // Create new leave record
          const newLeaveRecord = new leavebalance({
            employee_id,
            leaves: {
              total: totalLeaves,
              available: totalLeaves,
              consume: 0,
            },
          });
          await newLeaveRecord.save();
        }

        console.log(
          `_id: ${employee_id}, probationEndDate: ${probationEndDate}, totalLeaves: ${totalLeaves}`
        );
      })
    );

    if (res) {
      res.status(200).json({
        success: true,
        msg: "Leaves have been processed successfully.",
      });
    }
  } catch (error) {
    console.error("Error processing leaves:", error);
    if (res) {
      res.status(500).json({
        success: false,
        msg: "Server error",
        error: error.message,
      });
    } else {
      // If res is not defined, log the error
      console.error("Cannot send response:", error.message);
    }
  }
};
addLeaves();
// Optionally, uncomment to run this function every year on April 1st
// setInterval(addLeaves, 365 * 24 * 60 * 60 * 1000); // 365 days in milliseconds

const addHolidays = async (req, res) => {
  try {
    // Get the holiday data from the request body
    const { optionalholiday, mandatoryholiday, weekendHoliday } = req.body;

    // Validate input format
    if (
      !Array.isArray(optionalholiday) ||
      !Array.isArray(mandatoryholiday) ||
      !Array.isArray(weekendHoliday)
    ) {
      return res.status(400).json({
        success: false,
        msg: "Invalid data format. Ensure optionalholiday, mandatoryholiday, and weekendHoliday are arrays.",
      });
    }

    // Find all leave balance records
    const leaveRecords = await leavebalance.find();

    // Process each leave record
    await Promise.all(
      leaveRecords.map(async (leaveRecord) => {
        // Update the leave record with new holidays
        leaveRecord.optionalholiday = [
          ...(leaveRecord.optionalholiday || []),
          ...optionalholiday,
        ];
        leaveRecord.mandatoryholiday = [
          ...(leaveRecord.mandatoryholiday || []),
          ...mandatoryholiday,
        ];
        leaveRecord.weekendHoliday = [
          ...(leaveRecord.weekendHoliday || []),
          ...weekendHoliday,
        ];

        // Save the updated leave record
        await leaveRecord.save();

        console.log(
          `Updated leave record for employee _id: ${leaveRecord.employee_id}`
        );
      })
    );

    res.status(200).json({
      success: true,
      msg: "Holidays have been added successfully.",
    });
  } catch (error) {
    console.error("Error adding holidays:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addLeaves,
  addHolidays,
};
