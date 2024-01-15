"use strict";
const { json } = require("body-parser");
const fs = require("fs");
// const path = require("path");
const XLSX = require("xlsx");
const axios = require("axios");
const Customers = require("../models/customers.models");
const configs = require("../../../config/common.config");

// const refreshToken = require("../../../../Main/Quickbooks/RefershToken");

exports.upsert = async function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
    .status(400)
    .send({ error: true, message: "Please provide all required field" });
  } else {

    const ExceptionLog=()=>{
      
    }
    
    let quickbookID = 0;
    const customerobject = {
      FullyQualifiedName: req.body.companyname,
      PrimaryEmailAddr: {
        Address: req.body.email,
      },
      DisplayName: req.body.companyname,
      Suffix: req.body.lastname,
      Title: "Mr",
      MiddleName: req.body.firstname,
      Notes: "Here are other details.",
      FamilyName: req.body.lastname,
      PrimaryPhone: {
        FreeFormNumber: req.body.phonenumber,
      },
      CompanyName: req.body.companyname,
      BillAddr: {
        CountrySubDivisionCode: "CA",
        City: req.body.city,
        PostalCode: req.body.zip,
        Line1: req.body.address1,
        Country: req.body.country,
      },
      GivenName: "James",
    };


    const updateobject = {
      "FullyQualifiedName": req.body.companyname,
      "PrimaryEmailAddr": {
        "Address": req.body.email,
      },
      "DisplayName": req.body.companyname,
      "GivenName": req.body.firstname+" "+req.body.lastname,
      "Suffix": req.body.lastname,
      "Title": "Mr",
      "MiddleName": req.body.firstname,
      "Notes": "Here are other details.",
      "FamilyName": req.body.lastname,
      "PrimaryPhone": {
        "FreeFormNumber": req.body.phonenumber,
      },
      "CompanyName": req.body.companyname,
      "BillAddr": {
        "CountrySubDivisionCode": "CA",
        "City": req.body.city,
        "PostalCode": req.body.zip,
        "Line1": req.body.address1,
        "Country": req.body.country,
      },
      "Id": req.body.quickbookid,
      "sparse": true
     }


    const PostData=async (tokenData,customerobject,req)=>{
     
      try {
        console.log("quickbooks")
        const responsedata = await axios
          .post(
            `https://sandbox-quickbooks.api.intuit.com/v3/company/${tokenData.realmid}/customer?minorversion=40`, customerobject,
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${tokenData.accesstoken}`,
              },
            }
          )
          const sucessobject = {
            MethodName: "upsert",
            ClassName: "customer.controller.js",
            Request: JSON.stringify(req.body),
            Response: JSON.stringify(responsedata),
            Status: JSON.stringify(responsedata.status),
            Message: JSON.stringify(responsedata.statusText),
            ModuleType: "customer",
            CreatedBy: req.body.loginuserid,
          };
          console.log(sucessobject, "success object +++>");
          axios.post(
            `${configs.quickbookBaseUrl}/quickbooks/exceptionquickbooksyc`,
            sucessobject,
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${tokenData.accesstoken}`,
              },
            }
          );
        console.log(responsedata.data, "responsedata1234")
        const quickbookid = responsedata.data?.Customer?.Id;
        return quickbookid;
     
     
      } catch (error) {
        const errorobject = {
          MethodName: "upsert",
          ClassName: "suppliers.controller.js",
          Request: JSON.stringify(req.body),
          Response: JSON.stringify(err),
          Status: "400",
          Message: err.code,
          ModueType: "suppliers",
          CreatedBy: req.body.loginuserid,
        };
        console.log(errorobject, "errorobject");
        axios.post(
          `${configs.quickbookBaseUrl}/quickbooks/exceptionquickbooksyc`,
          errorobject,

          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: `Bearer ${tokenData.accesstoken}`,
            },
          }
        );
        console.error('Error during Axios call:', error);
        throw error; // Propagate the error if needed
      }  
    }


    const UpdateData = async (tokenData, customerobject) => {
      try {
        const existingCustomer = await axios.get(
          `https://sandbox-quickbooks.api.intuit.com/v3/company/${tokenData.realmid}/customer/${customerobject.Id}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.accesstoken}`,
            },
          }
        );
    
        // Extracting the SyncToken from the existing customer data
        const syncToken = existingCustomer?.data?.Customer.SyncToken;
    
        // Including the SyncToken in the update request
        const responsedata = await axios.post(
          `https://sandbox-quickbooks.api.intuit.com/v3/company/${tokenData.realmid}/customer`,
          { ...customerobject, SyncToken: syncToken },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: `Bearer ${tokenData.accesstoken}`,
            },
          }
        );
    
        console.log(responsedata.data, "responsedata1234");
        const quickbookid = responsedata.data?.Customer?.Id;
        return quickbookid;
      } catch (error) {
        console.error("Error during Axios call:", error);
        throw error; // Propagate the error if needed
      }
    };
    


    axios
      .get(
        `${configs.quickbookBaseUrl}/quickbooks/refreshtoken?loginuserid=${req.body.loginuserid}`
      )
      .then((responseResult) => {
        console.log("response", responseResult.data.ResponseData);
        const tokenData = responseResult.data.ResponseData;

        // const tokenData = await refreshToken(req.body);
        if (tokenData.IsValid) {
          if (req.body.id == 0) {

          
            
            (async () => {
              try {
                quickbookID = await PostData(tokenData, customerobject,req.body);
                console.log(quickbookID, "quickbookID");
                // Continue with your logic here or call functions that use quickbookid
                Quickbooks(quickbookID)
              } catch (error) {
                console.error('Error:', error);
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
            // console.log("hello")
            (async () => {
              try {
                quickbookID = await UpdateData(tokenData, updateobject,req.body);
                console.log(quickbookID, "quickbookID");
               
                upsertcustomer(quickbookID);
              } catch (error) {
                console.error('Error:', error);
              }
            })();
          }
        }
      })
      .catch((error) => {
        console.log(error);
        Quickbooks("")
      });


    // console.log(quickbookID, "quickbookID 1");

    const Quickbooks=async (quickbookID)=>{
      try {
        const data=await Customers.upsert(req.body, quickbookID, function (err, result) {
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
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
     
  }
};

exports.findall = function (req, res) {
  //handles null error
  Customers.findall(req.query, function (err, result) {
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

exports.findbyid = function (req, res) {
  //handles null error
  Customers.findbyid(req.query, function (err, result) {
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
  Customers.excelexportlisting(req.query, function (err, result) {
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
  Customers.delete(req.body, function (err, result) {
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
        ResponseMessage: "Record Has been Deleted Successfully",
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
exports.managedelete = function (req, res) {
  //handles null error
  Customers.managedelete(req.query, function (err, result) {
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
exports.selectedcustomer = function (req, res) {
  //handles null error
  Customers.selectedcustomer(req.query, function (err, result) {
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

exports.exportexcel = function (req, res) {
  //handles null error
  Customers.exportexcel(req.body, function (err, result) {
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
  const fileName = `customers_export_${Date.now()}.xlsx`;
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

exports.intakeformupsert = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Customers.intakeformupsert(req.body, function (err, result) {
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result[0].ID > 0) {
        res.json({
          ResponseID: result[0].ID,
          ResponseCode: "SUCCESS",
          ResponseData: [],
          ResponseMessage: "Data save successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result[0].ID == -1) {
        res.json({
          ResponseID: result[0].ID,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "Email Already Exists!",
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

exports.undeletecustomer = function (req, res) {
  //handles null error
  Customers.undeletecustomer(req.body, function (err, result) {
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
        ResponseMessage: "Record Has been UnDeleted Successfully",
        ResponseJSON: "",
        OtherData: "",
      });
    } else if (result == -2) {
      res.json({
        ResponseID: result,
        ResponseCode: "ERROR",
        ResponseData: [],
        ResponseMessage: "Process incomplete!",
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

exports.cleanupcustomer = function (req, res) {
  //handles null error
  Customers.cleanupcustomer(req.body, function (err, result) {
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
        ResponseMessage: "data cleanup successfully",
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
exports.upserttype = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Customers.upserttype(req.body, function (err, result) {
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
  Customers.selectalltype(req.query, function (err, result) {
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
exports.upsertcustomfield = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Customers.upsertcustomfield(req.body, function (err, result) {
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
  Customers.findAll(req.query, function (err, result) {
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
  const fileName = `customers_export_${Date.now()}.xlsx`;
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

exports.tableFieldsName = function (req, res) {
  //handles null error
  Customers.tableFieldsName(req.query, function (err, result) {
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

exports.importdata = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Customers.importdata(req.body, function (err, result) {
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
exports.customercustomgetall = function (req, res) {
  //handles null error
  Customers.customercustomgetall(req.query, function (err, result) {
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

// Barcode Select all
exports.barcodeselectalltype = function (req, res) {
  //handles null error
  Customers.barcodeselectalltype(req.query, function (err, result) {
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

//Barcode Upsert
exports.barcodeupsert = function (req, res) {
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    Customers.barcodeupsert(req.body, function (err, result) {
      console.log(result[0].ID);
      if (err)
        res.json({
          ResponseID: 0,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: err,
          ResponseJSON: "",
          OtherData: "",
        });

      if (result[0].ID > 0) {
        res.json({
          ResponseID: result[0].ID,
          ResponseCode: "SUCCESS",
          ResponseData: result,
          ResponseMessage: "Data save successfully!",
          ResponseJSON: "",
          OtherData: "",
        });
      } else if (result == -1) {
        res.json({
          ResponseID: result,
          ResponseCode: "ERROR",
          ResponseData: [],
          ResponseMessage: "",
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

// Barcode FindbyId
exports.barcodefindbyid = function (req, res) {
  //handles null error
  Customers.barcodefindbyid(req.query, function (err, result) {
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

exports.customerdropdown = function (req, res) {
  //handles null error
  Customers.customerdropdown(req.query, function (err, result) {
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

// exports.customvaluesfindbyid = function (req, res) {
//
//   //handles null error
//   Customers.customvaluesfindbyid(req.query, function (err, result) {
//
//     if (err)
//       res.json({
//         ResponseID: 0,
//         ResponseCode: "ERROR",
//         ResponseData: [],
//         ResponseMessage: err,
//         ResponseJSON: "",
//         OtherData: "",
//       });

//     if (result) {
//       res.json({
//         ResponseID: 0,
//         ResponseCode: "SUCCESS",
//         ResponseData: result,
//         ResponseMessage: "",
//         ResponseJSON: "",
//         OtherData: "",
//       });
//     } else res.json({ ResponseID: result, ResponseCode: "ERROR", ResponseData: [], ResponseMessage: "Something went wrong!", ResponseJSON: "", OtherData: "" });
//   });
// };

exports.customerinformation = function (req, res) {
  //handles null error
  Customers.customerinformation(req.query, function (err, result) {
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
    Customers.updatecomments(req.body, function (err, result) {
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

exports.customerstatement = function (req, res) {
  //handles null error
  Customers.customerstatement(req.query, function (err, result) {
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

// For Dropdown Suppliers Account
exports.cusomerstoreaccountlist = function (req, res) {
  //handles null error
  Customers.cusomerstoreaccountlist(req.query, function (err, result) {
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

//customer transaction list

exports.customertransactionlist = function (req, res) {
  //handles null error
  Customers.customertransactionlist(req.query, function (err, result) {
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

// Ecomm Userslisting

exports.ecommpendingcustomer = function (req, res) {
  //handles null error

  Customers.ecommpendingcustomer(req.query, function (err, result) {
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

exports.ecommuserupsert = function (req, res) {
  //handles null error
  Customers.ecommuserupsert(req.body, function (err, result) {
    // console.log(result)
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
