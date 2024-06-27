const express = require("express");
const router = express();

const permissionController = require("../controllers/admin/permissionController");

const { permissionAddValidator } = require("../helpers/adminValidator");

router.post(
  "/addpermission",
  permissionAddValidator,
  permissionController.addPermission
);

module.exports = router;
