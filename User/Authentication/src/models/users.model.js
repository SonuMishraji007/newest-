"use strict";
var dbConn = require("../../../config/db.config");
var Confidential = require("../../../config/confidential");
var Users = function (users) {};

Users.Registration = function (req, result) {
  let password = req.password;
  password = Confidential.generateHash(password);
  dbConn.query(
    "call proc_Users_Registration(?,?,?,?)",
    [req.name, req.emailid, password, req.googleid],
    function (err, res) {
      if (err) {
        // result(err, null);

        result(null, 0);
        throw new Error(err);
      } else {
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

Users.Login = function (req, result) {
  let password = req.password;
  password = Confidential.generateHash(password);
  dbConn.query(
    "call proc_Users_Authentication_Login(?,?,?)",
    [req.emailid, password, req.googleid],
    function (err, res) {
      if (err) {
        result(null, 0);
        throw new Error(err);
      } else {
        let data = {
          LoginUser: res[0],
          UserPemission: res[1],
        };
        result(null, data);
      }
    }
  );
};

Users.GetAllPermissionsByUser = function (req, result) {
  dbConn.query(
    "call proc_UserPermission_GetAllPermissionsByUser(?)",
    [req.userId],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Users.SendEmailToVerify = function (req, result) {
  dbConn.query(
    "call proc_users_verifyemail_ResetPassword(?,?)",
    [req[0].emailid, req[1]],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Users.GetIdFromCode = function (req, result) {
  dbConn.query(
    "call proc_Users_ForgotPassword_VerifyCode(?)",
    [req.id],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Users.UpdatePassword = function (req, result) {
  let password = req.password;
  password = Confidential.generateHash(password);
  dbConn.query(
    "call proc_Users_UpdatePassword(?,?)",
    [password, req.userid],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Users.findbyid = function (req, result) {
  dbConn.query(
    "call proc_EditProfile_selectById(?)",
    [req.Id],
    function (err, res) {
      if (err) {
        result(null, 0);
        throw new Error(err);
      } else {
        result(null, res[0]);
      }
    }
  );
};

Users.userpermissionbyuserid = function (req, result) {
  dbConn.query(
    "call proc_userpermission_selectall_byuserid(?)",
    [req.id],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        let data = {
          UserPermissions: res[0],
          UserDetails: res[1],
        };
        // console.log("res[0]",res[0]);
        // console.log("res[1]", res[1]);
        result(null, data);
      }
    }
  );
};

Users.updatedashboardtoggle = function (req, result) {
  console.log("req", req);
  dbConn.query(
    "call proc_dashboard_privacy_update(?,?)",
    [req.PrivacyDashboard, req.LoginUserId],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};


Users.locationupsert = function (req, result) {
  dbConn.query(
    "call proc_Users_UpdateDefaultLocations(?,?)",
    [req.loginuserid,req.locationid],
    function (err, res) {
      if (err) {
        // result(err, null);
        result(null, 0);
        throw new Error(err);
      } else {
        var insertIDArray = res[0];
        var keyValue = insertIDArray[0].ID;
        result(null, keyValue);
      }
    }
  );
};

module.exports = Users;
// module.exports = { Users, UserPermission: Users.GetAllPermissionsByUser };
