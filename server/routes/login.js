const bcrypt = require("bcrypt");
const Account = require("../models/AccountModel");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { verifyRootLevel, auth } = require("../middleware/auth");

/* router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All input is required");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const account = await Account.create({
      username: username,
      password: encryptedPassword,
      role: "root",
    });

    const token = jwt.sign(
      { account_id: account._id, username, role: "root" },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    account.token = token;
    res.status(201).json(account);
  } catch (err) {
    console.log(err);
    res.status(404).send();
  }
}); */

router.post("/register-as-admin", verifyRootLevel, async (req, res) => {
  try {
    const { username, password, permissionType, allowedForms } = req.body;
    if (!(username, password, permissionType, allowedForms)) {
      res.status(400).send("All input is required");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    const account = await Account.create({
      username,
      password: encryptedPassword,
      role: "admin",
      permissionType,
      allowedForms,
    });
    const token = jwt.sign(
      { account_id: account._id, username, role: account.role },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    account.token = token;
    res.status(201).send(account);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

router.get("/get-admin-details", auth, (req, res) => {
  try {
    Account.findById(req.account.account_id, { password: 0 })
      .then((response) => res.json(response))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-admins", verifyRootLevel, (req, res) => {
  try {
    Account.find({ role: "admin" })
      .then((response) => res.json(response))
      .catch((error) => {
        console.log(error);
        res.status(404).send(error);
      });
  } catch (error) {}
});

router.delete("/delete-admin", verifyRootLevel, (req, res) => {
  try {
    const { accountId } = req.body;
    if (!accountId) {
      res.status(400).send("All input is required");
      return;
    }
    Account.findById(accountId)
      .then((response) => {
        console.log(response);
        if (response.role !== "root") {
          Account.findByIdAndDelete({ _id: accountId })
            .then((deleteResponse) => res.json(deleteResponse))
            .catch((err) => {
              console.log(err);
              res.status(404).send(err);
            });
        } else {
          res.status(400).send("You cannot delete an root levet user.");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send(error);
      });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.put("/update-admin", verifyRootLevel, async (req, res) => {
  try {
    const { accountId, updatedAccount } = req.body;
    if (!(accountId, updatedAccount)) {
      res.status(404).send("All input is required.");
      return;
    }
    if (updatedAccount.role && updatedAccount.role !== "admin") {
      res.status(404).send("You cannot change an account's role.");
      return;
    }
    if (updatedAccount.password)
      updatedAccount.password = await bcrypt.hash(updatedAccount.password, 10);
    Account.findByIdAndUpdate(accountId, updatedAccount)
      .then((response) => res.json(response))
      .catch((error) => {
        console.log(error);
        res.status(404).send(error);
      });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username, password)) {
      res.status(400).send("All input is required");
      return;
    }
    const account = await Account.findOne({ username });

    if (account && (await bcrypt.compare(password, account.password))) {
      const token = jwt.sign(
        { account_id: account._id, username, role: account.role },
        process.env.TOKEN_KEY,
        {
          expiresIn: "12h",
        }
      );
      account.token = token;
      res.status(200).json(account);
      return;
    }
    res.status(400).send("Invalid Credentials");
    return;
  } catch (error) {
    console.log(error);
  }
});

router.post("/is-expired", (req, res) => {
  try {
    const decodedToken = jwt.decode(req.body.token, { complete: true });
    if (decodedToken.payload.exp < Date.now() / 1000) {
      res.send(true);
      return;
    }
    res.send(false);
    return;
  } catch (error) {
    console.error(error);
    res.send(true);
  }
});

router.post("/get-role", (req, res) => {
  try {
    if (req.body.token) {
      const decoded = jwt.verify(req.body.token, process.env.TOKEN_KEY);
      if (decoded.role) res.json({ role: decoded.role });
      res.status(404).send();
    }
    res.status(404).send();
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});
module.exports = router;
