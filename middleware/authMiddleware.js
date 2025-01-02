const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "Token is Required for Authorization",
    });
  }

  try {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    const decodedData = jwt.verify(bearerToken, process.env.ACCESS_TOKEN);

    req.employee = decodedData.employee;
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Token Expired or Invalid",
    });
  }

  return next();
};

module.exports = verifyToken;
