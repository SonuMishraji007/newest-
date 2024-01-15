"use strict";
var Quickbooks = function (quickbooks) {};
var dbConn = require("../config/db.config");

Quickbooks.exceptionQuickbook = function (req) {
  dbConn.query(
    "call proc_quickbooksyncLog_insert(?,?,?,?,?,?,?,?)",
    [
      req.MethodName,
      req.ClassName,
      req.Request,
      req.Response,
      req.Status,
      req.Message,
      req.ModueType,
      req.CreatedBy,
    ],
    function (err, res) {
      if (err) {
        // If an error occurs, handle it appropriately
        console.error(err);
      } else {
      }
    }
  );
};

module.exports = Quickbooks;
