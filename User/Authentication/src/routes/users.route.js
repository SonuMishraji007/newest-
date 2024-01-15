const express = require("express");
const router = express.Router();

const authJwt = require("../../../config/auth.middleware");
const usersController = require("../controllers/users.controller");

//user Registration
router.post("/registration", usersController.Registration);

// user login
router.post("/login", usersController.Login);

// get all permissions by user
router.get(
  "/getAllPermissionsByUser",
  [authJwt.verifyToken],
  usersController.GetAllPermissionsByUser
);

// forgot password
router.post("/forgotpassword", usersController.SendEmailToVerify);

// get id from verify code
router.post(
  "/resetpassword",
  // [authJwt.verifyToken],
  usersController.GetIdFromCode
);

// update password
router.post(
  "/updatepassword",
  // [authJwt.verifyToken],
  usersController.UpdatePassword
);

// find details of user by id
router.get("/findbyid", [authJwt.verifyToken], usersController.findbyid);

//Select by id
router.get(
  "/userpermissionbyuserid",
  [authJwt.verifyToken],
  usersController.userpermissionbyuserid
);
// Update privacy Dashboard Button
router.post(
  "/updatedashboardtoggle",
  // [authJwt.verifyToken],
  usersController.updatedashboardtoggle
);

router.post(
  "/locationupsert",
  [authJwt.verifyToken],
  usersController.locationupsert
);

module.exports = router;
