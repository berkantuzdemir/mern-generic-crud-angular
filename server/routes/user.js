const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();
const Cryptr = require("cryptr");
const multer = require("multer");
const {auth} = require("../middleware/auth");
const fs = require("fs");
const usersSecretKey = 'awiodnawlk2';

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback) {
    try {
      let fileType;
      if (file.mimetype === "image/png") {
        fileType = ".png";
      } else if (file.mimetype === "image/jpeg") {
        fileType = ".jpg";
      }
      callback(null, Date.now() + fileType);
    } catch (error) {
      console.log(error);
    }
  },
});

const upload = multer({ storage: storage });

router.get("/", auth, (req, res) => {
  try {
    const decryptedResponse = [];
    UserModel.find()
        .sort({ $natural: -1 })
        .then((response) => {
          response.forEach((item) => {
            decryptedResponse.push(decryptResponse(item));
          });
          res.json(decryptedResponse);
        })
        .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-users-by-department", auth, (req, res) => {
  try {
    const decryptedResponse = [];
    UserModel.find({ department: req.query.department })
        .then((response) => {
          response.forEach((item) => {
            decryptedResponse.push(decryptResponse(item));
          });
          res.json(decryptedResponse);
        })
        .catch((err) => res.json(err));
  } catch (error) {}
});

router.get("/get-existing-departments", auth, (req, res) => {
  try {
    UserModel.find({}, { department: 1, _id: 0 })
        .then((response) => {
          const departments = [];
          Object.keys(response).forEach((key) => {
            if (!departments.includes(response[key].department)) {
              departments.push(response[key].department);
            }
          });
          res.json(departments);
        })
        .catch((err) => res.json(err));
  } catch (error) {}
});

router.get("/get-user-by-id", auth, (req, res) => {
  try {
    UserModel.findById(req.query.id)
        .then((response) => {
          try {
            res.json(decryptResponse(response));
          } catch {
            res.json({ error: "Bad Authenticate data" });
            res.statusCode = "401";
          }
        })
        .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false,
      });
    } else {
      const user = new UserModel(encryptBody(req.body));
      user.image = `/img/${req.file.filename}`;

      user
          .save()
          .then((response) => {
            res.json(response);
          })
          .catch((error) => {
            console.log(error);
            res.status(400).send();
          });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/", auth, upload.single("file"), async (req, res) => {
  try {
    let newObject = encryptBody(req.body);
    if (req.file) {
      newObject.image = `/img/${req.file.filename}`;
      UserModel.find({ _id: req.body._id }, { image: 1 }).then((response) => {
        if (fs.existsSync("./images" + response[0].image.replace("/img", ""))) {
          fs.unlink("./images" + response[0].image.replace("/img", ""), (err) => {
            if (err) console.log(err);
          });
        }
      });
    }
    UserModel.findByIdAndUpdate(req.body._id, newObject)
        .then((response) => res.json(decryptResponse(response)))
        .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
});


router.delete("/delete-multiple", auth, (req, res) => {
  try {
    const ids = req.body["ids"];
    let images;
    UserModel.find({ _id: { $in: ids } }, { image: 1 })
        .then((response) => {
          images = response;
        })
        .then(() => {
          UserModel.deleteMany({ _id: { $in: ids } })
              .then((response) => {
                for (var index in images) {
                  fs.unlink("./images" + images[index].image.replace("/img", ""), (err) => {
                    if (err) console.log(error);
                  });
                }
                res.json(response);
              })
              .catch((error) => console.log(error));
        });
  } catch (error) {
    console.log(error);
  }
});

const decryptResponse = (response) => {
  try {
    const cryptr = new Cryptr(usersSecretKey);
    const decrpytedData = cryptr.decrypt(response.description);
    response.description = decrpytedData;
    return response;
  } catch (error) {
    console.log(error);
  }
};
const encryptBody = (body) => {
  try {
    const cryptr = new Cryptr(usersSecretKey);
    const encryptedData = cryptr.encrypt(body.description);
    body.description = encryptedData;
    return body;
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;