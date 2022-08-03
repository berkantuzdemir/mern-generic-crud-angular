const jwt = require("jsonwebtoken");

const config = process.env;

const auth = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.account = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyRootLevel = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.account = decoded;
    if (decoded.role == "root") return next();
    else res.status(401).send("You are not a root level user.")
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = { auth, verifyRootLevel };
