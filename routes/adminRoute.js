const express = require("express");
const router = express();

const auth = require("../middleware/authMiddleware");

const permissionController = require("../controllers/admin/permissionController");
const roleController = require("../controllers/admin/roleController");

const { onlyAdminAccess } = require("../middleware/adminMiddleware");

const {
  permissionAddValidator,
  permissionDeleteValidator,
  permissionUpdateValidator,
  storeRoleValidator,
} = require("../helpers/adminValidator");

//this routes only accessible from admin role
router.post(
  "/addpermission",
  auth,
  onlyAdminAccess,
  permissionAddValidator,
  permissionController.addPermission
);

router.get(
  "/getpermissions",
  auth,
  onlyAdminAccess,
  permissionController.getPermission
);

router.post(
  "/deletepermissions",
  auth,
  onlyAdminAccess,
  permissionDeleteValidator,
  permissionController.deletePermission
);

router.post(
  "/updatepermissions",
  auth,
  onlyAdminAccess,
  permissionUpdateValidator,
  permissionController.updatePermission
);

//role routes
router.post(
  "/storerole",
  auth,
  onlyAdminAccess,
  storeRoleValidator,
  roleController.storeRole
);

router.get(
  "/getroles",
  auth,
  onlyAdminAccess,
  storeRoleValidator,
  roleController.getroles
);

module.exports = router;
