"use strict";
const { json } = require("body-parser");
// const fs = require("fs");
// const path = require("path");
const XLSX = require("xlsx");
const axios = require("axios");
const configs = require("../../../config/auth.config");
var jwt = require("jsonwebtoken");
// const configs = require("../../../Authentication/config/common.config");
const Employees = require("../models/employees.models.js");

exports.upsert = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Employees.upsert(req.body, function (err, result) {
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result > 0) {
        res.json({
          ResponseID: result,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "Data save successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result == -1) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Email already exists!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result == -3) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "EmployeeNumber already exists!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something went wrong!",
          ResponseJSON: "",
          OtherData: "",
        });
    });
  }
};

exports.customfieldupsert = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Employees.customfieldupsert(req.body, function (err, result) {
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result > 0) {
        res.json({
          ResponseID: result,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "Data save successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result == -1) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Name already exists!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something went wrong!",
          ResponseJSON: "",
          OtherData: "",
        });
    });
  }
};

exports.findall = function (req, res) {
  //handles null error
  Employees.findall(req.query, function (err, result) {
    //
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.excelexport = function (req, res) {
  //handles null error
  Employees.excelexport(req.body, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    /*if (result) {
      const headers = Object.keys(result[0]);
      const aoa = [
        headers,
        ...result.map((obj) => headers.map((key) => obj[key])),
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const binaryData = new Buffer.from(
        XLSX.write(wb, { bookType: "xlsx", type: "array" })
      );
      const downloadsPath = path.join(process.env.USERPROFILE, "Downloads");
      const fileName = `employees_export_${Date.now()}.xlsx`;
      const filePath = path.join(downloadsPath, fileName);
      fs.writeFileSync(filePath, binaryData);
      res.download(filePath);

      res.json({
        ResponseID: result[0].ID,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};*/

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.findbyid = function (req, res) {
  //handles null error
  Employees.findbyid(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.batchdelete = function (req, res) {
  //handles null error
  Employees.batchdelete(req.body, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: result[0].ID,
        ResponseCode: "SUCCESS",
        ResponseData: [],
        ResponseMessage: "data deleted successfully",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.undeletemutiple = function (req, res) {
  //handles null error
  Employees.undeletemutiple(req.body, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: result[0].ID,
        ResponseCode: "SUCCESS",
        ResponseData: [],
        ResponseMessage: "data undeleted successfully",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.deletepermanantely = function (req, res) {
  //handles null error
  Employees.deletepermanantely(req.body, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: result[0].ID,
        ResponseCode: "SUCCESS",
        ResponseData: [],
        ResponseMessage: "data deleted permanantely",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.managedelete = function (req, res) {
  //handles null error
  Employees.managedelete(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.employeelanguagesdropdown = function (req, res) {
  //handles null error
  Employees.employeelanguagesdropdown(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.employeeregisterdropdown = function (req, res) {
  //handles null error
  Employees.employeeregisterdropdown(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.employeecommissiondropdown = function (req, res) {
  //handles null error
  Employees.employeecommissiondropdown(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.rolesdropdown = function (req, res) {
  //handles null error
  Employees.rolesdropdown(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.usersdropdown = function (req, res) {
  //handles null error
  Employees.usersdropdown(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.employeescustomgetall = function (req, res) {
  //handles null error
  Employees.employeescustomgetall(req.query, function (err, result) {
    // if (err)
    //   res.json({
    //     ResponseID: 0,
    //     ResponseCode: "ERROR",
    //     ResponseData: [],
    //     ResponseMessage: err,
    //     ResponseJSON: "",
    //     OtherData: "",
    //   });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};
exports.permissionupsert = function (req, res) {
  console.log("---------> " + req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Employees.permissionupsert(req.body, function (err, result) {
      console.log("Fromcontroller", result);
      //
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result > 0) {
        res.json({
          ResponseID: result,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "Data save successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result == -1) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Email already exists!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result == -3) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "EmployeeNumber already exists!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something went wrong!",
          ResponseJSON: "",
          OtherData: "",
        });
    });
  }
};

exports.permissionselectall = function (req, res) {
  console.log("---------> " + req.query);
  //handles null error
  Employees.permissionselectall(req.query, function (err, result) {
    console.log(result);
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};
exports.selectedemployee = function (req, res) {
  //handles null error
  Employees.selectedemployee(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 0,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.delete = function (req, res) {
  //handles null error
  Employees.delete(req.body, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result == 1) {
      res.json({
        ResponseID: result,
        ResponseCode: "SUCCESS",
        ResponseData: [],
        ResponseMessage: "data deleted successfully",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result == -2) {
      res.json({
        ResponseID: result,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: "Process incompleted!",
        ResponseJSON: "",
        OtherData: "",
      });
    } else
      res.json({
        ResponseID: result,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: "Something went wrong!",
        ResponseJSON: "",
        OtherData: "",
      });
  });
};

exports.userfindbyid = function (req, res) {
  //handles null error
  Employees.userfindbyid(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    if (result) {
      res.json({
        ResponseID: 1,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
  });
};

exports.update = function (req, res) {
  console.log("res", res);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Employees.update(req.body, function (err, result) {
      console.log("result", result);
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result[0].Id > 0) {
        res.json({
          ResponseID: result,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "Data save successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result[0].Id == -1) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Name already exists!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something went wrong!",
          ResponseJSON: "",
          OtherData: "",
        });
    });
  }
};

exports.updatepassword = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Employees.updatepassword(req.body, function (err, result) {
      console.log("id", result[0].ID);
      console.log("name", result[0].Name);
      console.log("email;", result[0].EmailId);
      if (result[0].ID > 0) {
        const emailTemplateCode = "EMAILTEMPLATE_UPDATEPASSWORD";
        console.log("id", result[0].ID);
        console.log("name", result[0].Name);
        console.log("email;", result[0].EmailId);
        // get DETAILS by Email Template
        axios
          .get(
            `${configs.generalBaseUrl}/generals/findbyemailtemplate?emailtemplate=${emailTemplateCode}`
          )
          .then((res) => {
            console.log("response", res.data.ResponseData);
            // let url = `https://portal.sonarpos.com/reset/${Code}`;
            let to = result[0].EmailId;
            // console.log("testtt", res.data.ResponseData[0].BodyHtml);

            let emailTemplateData = res.data.ResponseData[0];
            let emailSubject = emailTemplateData.EmailSubject;
            let bodyMessage = emailTemplateData.BodyHtml.replace(
              "#USERNAME#",
              result[0].Name
            );
            console.log("bodyMessage", bodyMessage);
            axios
              .post(`${configs.generalBaseUrl}/generals/sendemail`, {
                to: to,
                subject: emailSubject,
                bodymessage: bodyMessage,
              })
              .then((res) => {
                console.log("success mail");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        res.json({
          ResponseID: 0,
          ResponseCode: "SUCCESS",
          ResponseData: result,
          ResponseMessage: "Password Updated successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result[0].ID == -1) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Please Enter Correct Password",
          ResponseJSON: "",
          OtherData: "",
        });
      }
    });
  }
};

exports.changepassword = function (req, res) {
  console.log("res", res);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Employees.changepassword(req.body, function (err, result) {
      console.log("result", result);

      if (result > 0) {
        res.json({
          ResponseID: result,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "Password Updated successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something Went Wrong Please try Again",
          ResponseJSON: "",
          OtherData: "",
        });
      }
    });
  }
};
