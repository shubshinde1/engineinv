const onlyHRAccess = async (req, res, next) => {
  try {
    if (req.employee.auth !== 2) {
      return res.status(400).json({
        success: false,
        msg: "You have not HR permissions",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong",
    });
  }

  return next();
};

module.exports = { onlyHRAccess };
