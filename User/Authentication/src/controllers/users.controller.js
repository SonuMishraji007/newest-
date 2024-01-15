("use strict");
const { json } = require("body-parser");
const axios = require("axios");
const Users = require("../models/users.model");
const config = require("../../../config/auth.config");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const configs = require("../../../config/common.config");

exports.Registration = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Users.Registration(req.body, function (err, result) {
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result > 0)
        res.json({
          ResponseID: result,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "User registration successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      else
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

exports.Login = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Users.Login(req.body, function (err, result) {
      console.log("From Login", result);
      // return
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result.LoginUser[0].Id > 0) {
        let token = jwt.sign({ id: result.LoginUser[0].Id }, config.secret, {
          //expiresIn: 86400 // 24 hours
          // expiresIn: 60 // 24 hours
        });

        let obj = {
          ID: result.LoginUser[0].Id,
          Name: result.LoginUser[0].Name,
          EmailId: result.LoginUser[0].EmailId,
          Token: token,
          Role: result.LoginUser[0].Role,
          Selectimage: result.LoginUser[0].Selectimage,
          PrivacyDashboard: result.LoginUser[0].PrivacyDashboard,
          LocationName: result.LoginUser[0].LocationName,
          LocationID: result.LoginUser[0].LocationID,
          DefaultLocationID: result.LoginUser[0].DefaultLocationID,
          UserPemission: result.UserPemission,
        };

        res.json({
          ResponseID: 0,
          ResponseCode: "SUCCESS",
          ResponseData: obj,
          ResponseMessage: "Login successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result.LoginUser[0].Id == -1) {
        res.json({
          ResponseID: result.LoginUser[0].Id,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Invalid username or password",
          ResponseJSON: "",
          OtherData: "",
        });
      } else
        res.json({
          ResponseID: result.LoginUser[0].Id,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something went wrong!",
          ResponseJSON: "",
          OtherData: "",
        });
    });
  }
};

exports.GetAllPermissionsByUser = function (req, res) {
  Users.GetAllPermissionsByUser(req.query, function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });

    res.json({
      ResponseID: 0,
      ResponseCode: "SUCCESS",
      ResponseData: result,
      ResponseMessage: "",
      ResponseJSON: "",
      OtherData: "",
    });
  });
};

exports.SendEmailToVerify = function (req, res) {
  let code = uuidv4();
  Users.SendEmailToVerify([req.body, code], function (err, result) {
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: err,
        ResponseJSON: "",
        OtherData: "",
      });
    console.log("results", result);
    if (result[0].ID == -1) {
      res.json({
        ResponseID: result[0].ID,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: "Your Email Is InCorrect",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result[0].ID > 0) {
      const emailTemplateCode = "EMAILTEMPLATE_FORGOTPASSWORD_REQUEST";
      // get DETAILS by Email Template
      axios
        .get(
          `${configs.generalBaseUrl}/generals/findbyemailtemplate?emailtemplate=${emailTemplateCode}`
        )
        .then((res) => {
          console.log("response", res.data.ResponseData);
          let url = `${configs.portalBaseUrl}/${code}`;
          console.log("url:",url)
          let to = result[0].EmailId;
          console.log("to", to);
          let emailTemplateData = res.data.ResponseData[0];
          let emailSubject = emailTemplateData.EmailSubject;
          let bodyMessage = emailTemplateData.BodyHtml.replace(
            "#USERNAME#",
            result[0].Name
          ).replace(/#CHANGEPASSWORDLINK#/g, url);

          axios
            .post(`${configs.generalBaseUrl}/generals/sendemail`, {
              to: to,
              subject: emailSubject,
              bodymessage: bodyMessage,
            })
            .then((res) => {
              console.log("success email");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });

      res.json({
        ResponseID: result[0].ID,
        ResponseCode: "SUCCESS",
        ResponseData: [],
        ResponseMessage:
          "We have sent a reset password link to your email. Please check! ",
        ResponseJSON: "",
        OtherData: "",
      });
    }
  });
};

exports.GetIdFromCode = function (req, res) {
  Users.GetIdFromCode(req.body, function (err, result) {
    if (result[0].ID > 0) {
      res.json({
        ResponseID: result[0].ID,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result[0].ID == -1) {
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: result,
        ResponseMessage: "Sorry, the token you provided is invalid!",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result[0].ID == -2) {
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: result,
        ResponseMessage: "Sorry, the token you provided is expired!",
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

exports.UpdatePassword = function (req, res) {
  Users.UpdatePassword(req.body, function (err, result) {
    console.log("result check", result);
    console.log("result1", result[0].Id);

    if (result[0].Id > 0) {
      console.log("result2", result);

      const emailTemplateCode = "EMAILTEMPLATE_UPDATEPASSWORD_";
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
          // console.log("emailTemplateData1", emailTemplateData.BodyHtml);
          // console.log("emailTemplateData2", res.data.ResponseData[0].BodyHTML);
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
              console.log("success email");
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
        ResponseMessage: "Password Updated Successfully",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result[0].ID == -1) {
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: result,
        ResponseMessage: "Token Expired!!!",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result[0].ID == -2) {
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: result,
        ResponseMessage: "Invalid Token!!!",
        ResponseJSON: "",
        OtherData: "",
      });
    }
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

exports.findbyid = function (req, res) {
  //handles null error
  Users.findbyid(req.query, function (err, result) {
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

exports.userpermissionbyuserid = function (req, res) {
  //handles null error
  Users.userpermissionbyuserid(req.query, function (err, result) {
    // console.log("userpermissionbyuserid", result);
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

exports.updatedashboardtoggle = function (req, res) {
  Users.updatedashboardtoggle(req.body, function (err, result) {
    console.log("Result", result);
    if (result > 0) {
      res.json({
        ResponseID: result,
        ResponseCode: "SUCCESS",
        ResponseData: result,
        ResponseMessage: "",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result == -1) {
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: result,
        ResponseMessage: "Sorry, the token you provided is invalid!",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result == -2) {
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: result,
        ResponseMessage: "Sorry, the token you provided is expired!",
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




exports.locationupsert = function (req, res) {
  //handles null error
  Users.locationupsert(req.body, function (err, result) {
    // console.log("userpermissionbyuserid", result);
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
