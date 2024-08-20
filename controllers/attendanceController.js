const Attendance = require("../model/attendaceModel"); // Adjust the path if needed
const LeaveApplication = require("../model/leaveApplicationModel"); // Adjust the path if needed
const Employee = require("../model/employeeModel");
const LeaveBalance = require("../model/leaveBalanceModel");

const { CronJob } = require("cron");

// Function to mark attendance
const markAttendance = async (req, res) => {
  try {
    const { employee_id, mark, inlocation, outlocation } = req.body;

    // Validate location data format
    if (
      mark === "In" &&
      (!inlocation || !inlocation.latitude || !inlocation.longitude)
    ) {
      return res.status(400).json({ message: "Invalid inlocation data." });
    }

    if (
      mark === "Out" &&
      (!outlocation || !outlocation.latitude || !outlocation.longitude)
    ) {
      return res.status(400).json({ message: "Invalid outlocation data." });
    }

    // Get the current datetime and date
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const currentTime = now.toISOString(); // Full datetime

    // Check if the employee has an approved leave for the date
    const leave = await LeaveApplication.findOne({
      employee_id,
      fromdate: { $lte: currentDate },
      todate: { $gte: currentDate },
      applicationstatus: 1, // approved leave
    });

    if (leave) {
      return res
        .status(400)
        .json({ message: "Cannot punch in/out during approved leave dates." });
    }

    // Find the existing attendance record for the date, if any
    let attendance = await Attendance.findOne({
      employee_id,
      date: currentDate,
    });

    if (attendance) {
      if (mark === "Out") {
        if (attendance.mark === "Out") {
          return res
            .status(400)
            .json({ message: "You have already punched out today." });
        }
        if (attendance.mark !== "In") {
          return res
            .status(400)
            .json({ message: "Cannot punch out without punching in first." });
        }
        attendance.outtime = currentTime;
        attendance.outlocation = outlocation;
        attendance.mark = mark;

        if (attendance.intime && attendance.outtime) {
          const intimeDate = new Date(attendance.intime);
          const outtimeDate = new Date(attendance.outtime);

          const totalMs = outtimeDate - intimeDate;

          if (!isNaN(totalMs)) {
            const totalHours = Math.floor(totalMs / (1000 * 60 * 60)); // Extract hours
            const totalMinutes = Math.floor(
              (totalMs % (1000 * 60 * 60)) / (1000 * 60)
            ); // Extract minutes

            // Format as "hr:mm"
            attendance.totalhrs = `${totalHours}:${
              totalMinutes < 10 ? "0" : ""
            }${totalMinutes}`;
            attendance.attendancestatus = totalHours >= 4 ? 1 : 2; // 1 = present full day, 2 = half day
          } else {
            attendance.totalhrs = "0:00";
            attendance.attendancestatus = 0; // Default to absent
          }
        }

        await attendance.save();
      } else if (mark === "In") {
        if (attendance.mark === "In") {
          return res
            .status(400)
            .json({ message: "You have already punched in today." });
        }
        if (attendance.mark === "Out") {
          return res
            .status(400)
            .json({ message: "You cannot punch in again for today." });
        }
        attendance.intime = currentTime;
        attendance.inlocation = inlocation;
        attendance.mark = mark;

        await attendance.save();
      } else {
        return res
          .status(400)
          .json({ message: 'Invalid mark value. Use "In" or "Out".' });
      }
    } else {
      // If no existing record, create a new attendance record
      if (mark === "Out") {
        return res
          .status(400)
          .json({ message: "Cannot punch out without punching in first." });
      }

      attendance = new Attendance({
        employee_id,
        date: currentDate,
        mark,
        intime: mark === "In" ? currentTime : undefined,
        inlocation: mark === "In" ? inlocation : undefined,
        outtime: mark === "Out" ? currentTime : undefined,
        outlocation: mark === "Out" ? outlocation : undefined,
      });

      await attendance.save();
    }

    return res
      .status(200)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Function to handle end-of-day logic for default paid leave
const endOfDayProcessing = async () => {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date

    const absentEmployees = await Attendance.find({
      date: currentDate,
      mark: { $ne: "Out" },
    });

    for (const employee of absentEmployees) {
      if (!employee.mark || employee.mark === "In") {
        // If employee didn't punch out, update their attendance to 'Absent'
        employee.attendancestatus = 0; // Absent
        await employee.save();
      }
    }

    console.log("End of day processing completed.");
  } catch (error) {
    console.error("Error in end of day processing:", error);
  }
};

// Function to get attendance for an employee
const getAttendance = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const attendance = await Attendance.find({ employee_id }).sort({
      date: -1,
    });

    return res.status(200).json({ attendance });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Function to check attendance for employees who haven't punched in by 11:57 AM
const checkAttendance = async () => {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // Get today's date
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

    // Get all employees
    const employees = await Employee.find();

    for (const employee of employees) {
      // Check if there's an attendance record for today
      let attendance = await Attendance.findOne({
        employee_id: employee._id,
        date: currentDate,
      });

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // If dayOfWeek is Saturday or Sunday, update status to week off
        if (!attendance) {
          attendance = new Attendance({
            employee_id: employee._id,
            date: currentDate,
            attendancestatus: 3, // Week off
          });
          await attendance.save();
        } else {
          attendance.attendancestatus = 3; // Week off
          await attendance.save();
        }
      } else {
        if (!attendance) {
          // If no attendance record exists, create one with status 'Absent'
          attendance = new Attendance({
            employee_id: employee._id,
            date: currentDate,
            attendancestatus: 0, // Absent
          });
          await attendance.save();

          // Update leave balance
          const leaveBalance = await LeaveBalance.findOne({
            employee_id: employee._id,
          });

          if (leaveBalance) {
            leaveBalance.leaves.available = (
              leaveBalance.leaves.available - 1
            ).toFixed(1);
            leaveBalance.leaves.consume = (
              leaveBalance.leaves.consume + 1
            ).toFixed(1);
            await leaveBalance.save();
          }
        } else if (attendance.mark !== "In") {
          // If record exists but hasn't marked "In", update status to 'Absent'
          attendance.attendancestatus = 0; // Absent
          await attendance.save();

          // Update leave balance
          const leaveBalance = await LeaveBalance.findOne({
            employee_id: employee._id,
          });

          if (leaveBalance) {
            leaveBalance.leaves.available = (
              leaveBalance.leaves.available - 1
            ).toFixed(1);
            leaveBalance.leaves.consume = (
              leaveBalance.leaves.consume + 1
            ).toFixed(1);
            await leaveBalance.save();
          }
        }
      }
    }

    console.log("Attendance check completed at 11:57 AM.");
  } catch (error) {
    console.error("Error in attendance check:", error);
  }
};
// checkAttendance();
const attendaceCheck = new CronJob("59 12 * * *", checkAttendance);

module.exports = {
  markAttendance,
  endOfDayProcessing,
  getAttendance,
  attendaceCheck,
};
