const express = require("express");
const { default: mongoose, Schema } = require("mongoose");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { auth, verifyRootLevel } = require("../middleware/auth");
const jsonwebtoken = require("jsonwebtoken");
const AccountModel = require("../models/AccountModel");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images/formIcons");
  },
  filename: function (req, file, callback) {
    let fileType;
    if (file.mimetype === "image/png") {
      fileType = ".png";
    } else if (file.mimetype === "image/jpeg") {
      fileType = ".jpg";
    }
    callback(null, Date.now() + fileType);
  },
});

const upload = multer({ storage: storage });

// Creates a form by requested fields
router.post("/create-form", verifyRootLevel, upload.single("file"), (req, res) => {
  try {
    const formStructure = JSON.parse(req.body.formStructure);

    userDefinedFormPattern = formStructure[0];

    if (!mongoose.models.formSchemas) {
      createSchemasModel();
    }
    const formSetupModel = mongoose.models.formSchemas;

    const formSetupData = {
      formName: formStructure[1].formName,
      description: formStructure[1].description,
      formDetails: userDefinedFormPattern,
      icon: `/img/formIcons/${req.file.filename}`,
      primaryColor: formStructure[1].primaryColor,
    };
    const formSetup = new formSetupModel(formSetupData);
    formSetup
      .save()
      .then((response) => res.json(response))
      .catch((error) => {
        console.error(error);
        res.status(422).send(error);
      });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

// Returns list of forms
router.get("/get-forms", auth, (req, res) => {
  try {
    const decoded = req.account;
    if (decoded.role === "admin") {
      if (!mongoose.models.formSchemas) {
        createSchemasModel();
      }
      AccountModel.findById(decoded.account_id, { "allowedForms.formId": 1, _id: 0 }).then(
        (formResponse) => {
          let formIds = [];
          Object.values(formResponse.allowedForms).forEach((value) => {
            formIds.push(value.formId);
          });
          mongoose.models.formSchemas
            .find({ _id: { $in: formIds } })
            .then((response) => {
              res.json(response);
            })
            .catch((err) => {
              console.log(err);
              res.status(404).send();
            });
        }
      );
    } else if (decoded.role === "root") {
      if (!mongoose.models.formSchemas) {
        createSchemasModel();
      }
      mongoose.models.formSchemas
        .find()
        .then((response) => {
          res.json(response);
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send();
        });
    }
  } catch (error) {}
});

router.put("/update-form", auth, upload.single("file"), async (req, res) => {
  try {
    const formStructure = JSON.parse(req.body.formStructure);
    const isAllowed = await checkPermission(req.account, formStructure[2].form_id);
    if (req.account.role === "root" || (req.account.role === "admin" && isAllowed)) {
      if (!mongoose.models.formSchemas) {
        createSchemasModel();
      }
      const formSetupModel = mongoose.models.formSchemas;

      const formSetupData = {
        formName: formStructure[1].formName,
        description: formStructure[1].description,
        formDetails: formStructure[0],
        icon: `/img/formIcons/${req.file.filename}`,
        primaryColor: formStructure[1].primaryColor,
      };
      formSetupModel
        .findByIdAndUpdate({ _id: formStructure[2].form_id }, formSetupData)
        .then((response) => {
          if (fs.existsSync("./images/formIcons" + response.icon.replace("/img/formIcons", ""))) {
            fs.unlink("./images/formIcons" + response.icon.replace("/img/formIcons", ""), (err) => {
              if (err) console.log(err);
            });
          }
          res.json(response);
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send();
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

const checkDeletionPermission = async (account, form_ids) => {
  let isAllowed = false;
  return new Promise((resolve, reject) => {
    AccountModel.findById(account.account_id, { allowedForms: 1, _id: 0 })
      .then((formResponse) => {
        for (item of formResponse.allowedForms) {
          if (form_ids.includes(item.formId) || item.permissionType !== "write") {
            isAllowed = true;
            break;
          }
        }
        resolve(isAllowed);
      })
      .catch((err) => {
        console.log(error);
      });
  });
};

router.delete("/delete-forms", auth, async (req, res) => {
  try {
    const form_ids = req.body["form_ids"];
    let isAllowed = await checkDeletionPermission(req.account, form_ids);
    console.log(isAllowed);
    if (!mongoose.models.formSchemas) {
      createSchemasModel();
    }
    if (req.account.role === "root" || (req.account.role === "admin" && isAllowed)) {
      mongoose.models.formSchemas
        .find({ _id: { $in: form_ids } }, { formName: 1 })
        .then((response) => {
          if (response) {
            response.forEach((item) => {
              mongoose.connection.dropCollection(item.formName, (err, result) => {
                if (err) console.log(err);
                if (result) console.log(result);
              });
            });
          }
        })
        .then(() => {
          mongoose.models.formSchemas
            .deleteMany({
              _id: { $in: form_ids },
            })
            .then((response) => {
              res.json(response);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    console.log(error);
  }
});

// Posts a document to form collection
router.post("/", (req, res) => {
  try {
    if (!mongoose.models.formSchemas) {
      createSchemasModel();
    }
    mongoose.models.formSchemas
      .findOne({ _id: req.body.form_id })
      .then((response) => {
        if (response) {
          const formModel = getModel(response);
          const data = new formModel(req.body);
          data
            .save()
            .then((response) => res.json(response))
            .catch((err) => {
              console.log(err);
              res.status(400).send();
            });
          return;
        }
        res.status(404).send("Form is unavailable");
        return;
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send();
      });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});
// Returns the requested form documents
router.post("/get-form", auth, (req, res) => {
  try {
    if (req.account.role === "root") {
      getRequestedForm(req.body.formId, null, null)
        .then((allowedFormResponse) => {
          res.json(allowedFormResponse);
          return;
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send();
          return;
        });
    } else {
      const id = req.account.account_id;
      AccountModel.findById(id, { allowedForms: 1 })
        .then((response) => {
          const index = response.allowedForms.findIndex((object) => {
            return object.formId === req.body.formId;
          });
          getRequestedForm(
            response.allowedForms[index].formId,
            response.allowedForms[index].allowedField,
            response.allowedForms[index].allowedValue
          )
            .then((allowedFormResponse) => {
              res.json(allowedFormResponse);
              return;
            })
            .catch((err) => {
              console.log(err);
              res.status(404).send();
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send();
        });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/get-form-details", async (req, res) => {
  try {
    if (!mongoose.models.formSchemas) {
      createSchemasModel();
    }
    mongoose.models.formSchemas
      .findById(req.body.formId)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

const getRequestedForm = (formId, field, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (!mongoose.models.formSchemas) {
        createSchemasModel();
      }
      mongoose.models.formSchemas
        .findById(formId)
        .then((response) => {
          if (response) {
            const formModel = getModel(response);
            formModel
              .find({ [field]: [value] })
              .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// Update a document from a Form
router.put("/", auth, async (req, res) => {
  try {
    const isAllowed = await checkPermission(req.account, req.body.form_id);
    if (req.account.role === "root" || (req.account.role === "admin" && isAllowed)) {
      if (!mongoose.models.formSchemas) {
        createSchemasModel();
      }
      mongoose.models.formSchemas
        .findOne({ _id: req.body.form_id })
        .then((response) => {
          if (response) {
            const formModel = getModel(response);
            formModel
              .findByIdAndUpdate(req.body.document_id, req.body)
              .then((response) => res.json(response))
              .catch((err) => console.log(err));
            return;
          }
          res.status(404).send("Form is unavailable");
          return;
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send();
        });
    } else {
      res.status(401).send("You are not authorized for that operation");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

// Delete a Document from a form
router.delete("/", auth, async (req, res) => {
  try {
    const isAllowed = await checkPermission(req.account, req.body.form_id);
    if (req.account.role === "root" || (req.account.role === "admin" && isAllowed)) {
      const ids = req.body["document_ids"];
      if (!mongoose.models.formSchemas) {
        createSchemasModel();
      }
      mongoose.models.formSchemas
        .findOne({ _id: req.body.form_id })
        .then((response) => {
          if (response) {
            const formModel = getModel(response);
            formModel
              .deleteMany({ _id: { $in: ids } })
              .then((response) => res.json(response))
              .catch((err) => console.log(err));
            return;
          }
          res.status(404).send("Form is unavailable");
          return;
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send();
        });
    } else {
      res.status(401).send("You are not authorized for that operation.");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

const getModel = (response) => {
  const formSchema = new mongoose.Schema(response.formDetails);
  if (!mongoose.models[response.formName]) {
    mongoose.model(response.formName, formSchema);
  }
  return mongoose.models[response.formName];
};

const createSchemasModel = () => {
  var formUploadSetup = {
    formName: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    formDetails: Object,
    icon: { type: String, required: true },
    primaryColor: { type: String, required: true },
  };
  const formSetupSchema = new Schema(formUploadSetup);
  mongoose.model("formSchemas", formSetupSchema);
};

const checkPermission = async (account, form_id) => {
  return new Promise((resolve, reject) => {
    if (account.role === "root") resolve(true);
    AccountModel.findById(account.account_id, { allowedForms: 1, _id: 0 })
      .then((formResponse) => {
        for (item of formResponse.allowedForms) {
          if (item.formId === form_id && item.permissionType === "write") {
            resolve(true);
          }
        }
        resolve(false);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = router;
