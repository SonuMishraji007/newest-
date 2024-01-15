"use strict";
const { json } = require("body-parser");
const XLSX = require("xlsx");
const Suppliers = require("../models/suppliers.model.js");
const configs = require("../../../config/common.config");
const quickbooklog = require("../../../config/Quickbooksynclog.js");
const axios = require("axios");

exports.upsert = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    const request = req.body;

    const Success = (postrequeestData, responsedata) => {
      const sucessobject = {
        MethodName: "upsert",
        ClassName: "suppliers.controller.js",
        Request: JSON.stringify(postrequeestData),
        Response: JSON.stringify(responsedata.data),
        Status: JSON.stringify(responsedata.status),
        Message: JSON.stringify(responsedata.statusText),
        ModueType: "suppliers",
        CreatedBy: postrequeestData.loginuserid,
      };
      return sucessobject;
    };

    const Error = (postrequeestData, error) => {
      const errorobject = {
        MethodName: "upsert",
        ClassName: "suppliers.controller.js",
        Request: JSON.stringify(postrequeestData),
        Response: JSON.stringify(error),
        Status: error.status,
        Message: error.code,
        ModueType: "suppliers",
        CreatedBy: postrequeestData.loginuserid,
      };
      return errorobject;
    };

    const vendorObject = {
      PrimaryEmailAddr: {
        Address: request.email,
      },
      WebAddr: {
        URI: " ",
      },
      PrimaryPhone: {
        FreeFormNumber: request.phonenumber,
      },
      DisplayName: request.companyname,
      Suffix: request.lastname,
      Title: "mr.",
      Mobile: {
        FreeFormNumber: request.phonenumber,
      },
      FamilyName: request.firstname,
      TaxIdentifier: " ",
      AcctNum: request.accountnumber,
      CompanyName: request.companyname,
      BillAddr: {
        City: request.city,
        Country: request.country,
        Line3: request.address1,
        Line2: request.address1,
        Line1: request.address2,
        PostalCode: request.zip,
        CountrySubDivisionCode: request.country,
      },
      GivenName: request.firstname,
      PrintOnCheckName: " ",
    };

    // updatereq object
    const vendorupdateobject = {
      PrimaryEmailAddr: {
        Address: request.email,
      },
      WebAddr: {
        URI: " ",
      },
      PrimaryPhone: {
        FreeFormNumber: request.phonenumber,
      },
      DisplayName: request.companyname,
      Suffix: request.lastname,
      Title: " ",
      Mobile: {
        FreeFormNumber: request.phonenumber,
      },
      FamilyName: request.firstname,
      TaxIdentifier: " ",
      AcctNum: request.accountnumber,
      CompanyName: request.companyname,
      BillAddr: {
        City: request.city,
        Country: request.country,
        Line3: request.address1,
        Line2: request.address1,
        Line1: request.address2,
        PostalCode: request.zip,
        CountrySubDivisionCode: request.country,
      },
      PrintOnCheckName: request.firstname,
      FamilyName: request.companyname,
      PrimaryPhone: {
        FreeFormNumber: request.phonenumber,
      },
      AcctNum: request.accountnumber,
      CompanyName: request.companyname,
      WebAddr: {
        URI: " ",
      },
      sparse: false,
      Active: true,
      Balance: 0,
      Id: req.body.quickbookid,
    };

    const PostData = async (tokenData, vendorObject, postrequeestData) => {
      // console.log(tokenData, vendorObject, "supplier12345");
      try {
        console.log("quickbooks");
        const responsedata = await axios.post(
          `${configs.quickbooksyncapiurl}/${tokenData.realmid}/vendor?minorversion=69`,
          vendorObject,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: `Bearer ${tokenData.accesstoken}`,
            },
          }
        );
        const sucessdata = Success(postrequeestData, responsedata);
        quickbooklog.exceptionQuickbook(sucessdata);
        const quickbookid = responsedata.data?.Vendor?.Id;
        return quickbookid;
      } catch (error) {
        console.error("Error during Axios call:", error);
        const errordata = Error(postrequeestData, error);
        quickbooklog.exceptionQuickbook(errordata);
        return 0;
      }
    };

    const UpdateData = async (tokenData, vendorObject, postrequeestData) => {
      console.log(tokenData, vendorObject, "supplier12345");
      try {
        const existingCustomer = await axios.get(
          `${configs.quickbooksyncapiurl}/${tokenData.realmid}/vendor/${vendorupdateobject.Id}?minorversion=40`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.accesstoken}`,
            },
          }
        );

        console.log(existingCustomer.data, "dataof excitin");

        // Extracting the SyncToken from the existing customer data
        const syncToken = existingCustomer?.data?.Vendor.SyncToken;

        // Including the SyncToken in the update request
        const responsedata = await axios.post(
          `${configs.quickbooksyncapiurl}/${tokenData.realmid}/vendor`,
          { ...vendorObject, SyncToken: syncToken },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: `Bearer ${tokenData.accesstoken}`,
            },
          }
        );

        console.log(responsedata.data, "responsedata1234");
        const sucessdata = Success(postrequeestData, responsedata);
        // console.log(sucessobject, "sucessobject");
        quickbooklog.exceptionQuickbook(sucessdata);
        const quickbookid = responsedata.data?.Vendor?.Id;
        return quickbookid;
      } catch (error) {
        console.error("Error during Axios call:", error);
        const errordata = Error(postrequeestData, error);
        // console.log(errorobject, "errorobject");
        quickbooklog.exceptionQuickbook(errordata);
        return 0; // Propagate the error if needed
      }
    };

    axios
      .get(
        `${configs.quickbookBaseUrl}/quickbooks/refreshtoken?loginuserid=${req.body.loginuserid}`
      )
      .then((responseResult) => {
        console.log("response", responseResult.data.ResponseData);
        const tokenData = responseResult.data.ResponseData;
        console.log(tokenData, "tokenData====>");

        if (tokenData.IsValid) {
          if (req.body.id == 0) {
            (async () => {
              try {
                const quickbookID = await PostData(
                  tokenData,
                  vendorObject,
                  req.body
                );
                console.log(quickbookID, "quickbookID");
                // Continue with your logic here or call functions that use quickbookid
                UpsertSupplier(quickbookID);
              } catch (error) {
                console.error("Error:", error);
                UpsertSupplier(0);
              }
            })();
            //  try {
            //   quickbookID = await PostData(tokenData, customerobject);
            //   console.log(quickbookID, "quickbookID 0");
            //  } catch (error) {
            //    console.log(error)
            //  }
          } else {
            //update
            (async () => {
              try {
                const quickbookID = await UpdateData(
                  tokenData,
                  vendorupdateobject,
                  req.body
                );
                console.log(quickbookID, "quickbookID");
                // Continue with your logic here or call functions that use quickbookid
                UpsertSupplier(quickbookID);
              } catch (error) {
                console.error("Error:", error);
                UpsertSupplier(0);
              }
            })();
          }
        }
      })
      .catch((error) => {
        console.log(error);
        UpsertSupplier(0);
      });

    const UpsertSupplier = async (quickbookID) => {
      try {
        const data = await Suppliers.upsert(
          req.body,
          quickbookID,
          function (err, result) {
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
                ResponseMessage: "AccountNumber already exists!",
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
          }
        );
      } catch (error) {
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something went wrong!",
          ResponseJSON: "",
          OtherData: "",
        });
      }
    };
  }
};

exports.upsertsuppliercustomfield = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Suppliers.upsertsuppliercustomfield(req.body, function (err, result) {
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
          ResponseMessage: "Email or account number already exists!",
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

exports.findAll = function (req, res) {
  //handles null error
  Suppliers.findAll(req.query, function (err, result) {
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

exports.excelexportlisting = function (req, res) {
  //handles null error
  Suppliers.excelexportlisting(req.query, function (err, result) {
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

exports.findbyid = function (req, res) {
  //handles null error
  Suppliers.findbyid(req.query, function (err, result) {
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

// For Dropdown Suppliers
exports.DropdownSupplier = function (req, res) {
  //handles null error
  Suppliers.DropdownSupplier(req.query, function (err, result) {
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
  Suppliers.batchdelete(req.body, function (err, result) {
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

exports.managedelete = function (req, res) {
  //handles null error
  Suppliers.managedelete(req.query, function (err, result) {
    console.log("result from =>", result);
    if (err)
      res.json({
        ResponseID: 0,
        ResponseCode: "ERROR",
        ResponseData: result,
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

exports.undeletemutiple = function (req, res) {
  //handles null error
  Suppliers.undeletemutiple(req.body, function (err, result) {
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

exports.supplierdetailforlabel = function (req, res) {
  //handles null error
  Suppliers.supplierdetailforlabel(req.query, function (err, result) {
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

exports.deletepermanantely = function (req, res) {
  //handles null error
  Suppliers.deletepermanantely(req.body, function (err, result) {
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

exports.exportexcel = function (req, res) {
  //handles null error
  Suppliers.exportexcel(req.body, function (err, result) {
    console.log("result12", result);
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
  const fileName = `supplier_export_${Date.now()}.xlsx`;
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

exports.upserttype = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Suppliers.upserttype(req.body, function (err, result) {
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
          ResponseMessage: "Email or account number already exists!",
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

exports.selectalltype = function (req, res) {
  //handles null error
  Suppliers.selectalltype(req.query, function (err, result) {
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

// exports.upsertsuppliercustomfield = function (req, res) {

//   //handles null error
//   if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//     res
//       .status(400)
//       .send({ error: true, message: "Please provide all required field" });
//   } else {
//     Suppliers.upsertsuppliercustomfield(req.body, function (err, result) {
//       //
//       if (err)
//         res.json({
//           ResponseID: 0,
//           ResponseCode: "ERROR",
//           ResponseData: [],
//           ResponseMessage: err,
//           ResponseJSON: "",
//           OtherData: "",
//         });

//       if (result > 0) {
//         res.json({
//           ResponseID: result,
//           ResponseCode: "SUCCESS",
//           ResponseData: [],
//           ResponseMessage: "Data save successfully!",
//           ResponseJSON: "",
//           OtherData: "",
//         });
//       } else if (result == -1) {
//         res.json({
//           ResponseID: result,
//           ResponseCode: "ERROR",
//           ResponseData: [],
//           ResponseMessage: "Email or account number already exists!",
//           ResponseJSON: "",
//           OtherData: "",
//         });
//       } else
//         res.json({
//           ResponseID: result,
//           ResponseCode: "ERROR",
//           ResponseData: [],
//           ResponseMessage: "Something went wrong!",
//           ResponseJSON: "",
//           OtherData: "",
//         });
//     });
//   }
// };

exports.findall = function (req, res) {
  //handles null error
  Suppliers.findall(req.body, function (err, result) {
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
      const fileName = `suppliers_export_${Date.now()}.xlsx`;
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
};

exports.tableFieldsName = function (req, res) {
  //handles null error
  Suppliers.tableFieldsName(req.query, function (err, result) {
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

exports.supplierscustomgetall = function (req, res) {
  //handles null error
  Suppliers.supplierscustomgetall(req.query, function (err, result) {
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

exports.importdata = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Suppliers.importdata(req.body, function (err, result) {
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

      if (result == 1) {
        res.json({
          ResponseID: result,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "Data imported successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Something went wrong!",
          ResponseJSON: "",
          OtherData: "",
        });
      }
    });
  }
};

exports.suppliercustomgetall = function (req, res) {
  //handles null error
  Suppliers.suppliercustomgetall(req.query, function (err, result) {
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

exports.supplierinformation = function (req, res) {
  //handles null error
  Suppliers.supplierinformation(req.query, function (err, result) {
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

exports.updatecomments = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Suppliers.updatecomments(req.body, function (err, result) {
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

// For Dropdown Suppliers Account
exports.supplierstoreaccountlist = function (req, res) {
  //handles null error
  Suppliers.supplierstoreaccountlist(req.query, function (err, result) {
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

exports.supplierstatement = function (req, res) {
  //handles null error
  Suppliers.supplierstatement(req.query, function (err, result) {
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
