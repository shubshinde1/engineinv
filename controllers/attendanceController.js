const { validationResult } = require("express-validator");
const Attendance = require("../model/attendaceModel");
const Employee = require("../model/employeeModel");

const employeeAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { employee_id, mark } = req.body;

    const employee = await Employee.findOne({ _id: employee_id });

    if (!employee) {
      return res.status(400).json({
        success: false,
        msg: "Employee not Exist",
      });
    }

    const currentDate = new Date();
    const localDate = currentDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    let attendance = await Attendance.findOne({ employee_id }).populate(
      "employee_id"
    );

    if (mark === "In") {
      if (attendance) {
        // If attendance record exists, update the attendanceHistory
        attendance.attendanceHistory.push({
          date: localDate,
          mark,
          intime: localDate,
        });
        await attendance.save();
      } else {
        // If no attendance record exists, create a new one
        attendance = new Attendance({
          employee_id,
          attendanceHistory: [
            {
              date: localDate,
              mark,
              intime: localDate,
            },
          ],
        });
        await attendance.save();
      }
    } else if (mark === "Out") {
      if (attendance && attendance.attendanceHistory.length > 0) {
        const lastEntry =
          attendance.attendanceHistory[attendance.attendanceHistory.length - 1];
        if (!lastEntry.outtime) {
          lastEntry.outtime = localDate;
          lastEntry.mark = mark;
          await attendance.save();
        } else {
          return res.status(400).json({
            success: false,
            msg: "Cannot punch out without punching in",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          msg: "Cannot punch out without punching in",
        });
      }
    }
    return res.status(200).json({
      success: true,
      msg: "Punch recorded successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const viewEmployeeAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    // Destructure id from req.body and handle if req.body is not present
    const { id } = req.body || null;

    if (id) {
      const employeeAttendance = await Attendance.findOne({
        _id: id,
      }).populate("employee_id");
      return res.status(200).json({
        success: true,
        msg: "Attendance Data fetched for selected employee",
        data: employeeAttendance,
      });
    } else {
      const allEmployeeAttendance = await Attendance.find();
      return res.status(200).json({
        success: true,
        msg: "All Employees Attendance Data fetched Successfully",
        data: allEmployeeAttendance,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { employeeAttendance, viewEmployeeAttendance };
