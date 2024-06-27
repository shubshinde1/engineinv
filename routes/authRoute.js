const express = require("express");
const router = express();

const authController = require("../controllers/authController");

const { registerValidator, loginValidator } = require("../helpers/validation");

router.post("/register", registerValidator, authController.registerEmployee);
router.post("/login", loginValidator, authController.loginEmployee);

module.exports = router;
