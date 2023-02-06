const jwt = require("jsonwebtoken");
const fs=require("fs")
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.auth?.split(" ")[1];
  if (token) {
    try {
      const blacklisted = JSON.parse(
        fs.readFileSync("./blacklist.json", "utf-8")
      );
      if (blacklisted.includes(token)) {
          res.send({ msg: " You are Logged Out" });
      } else {
        const decoded = jwt.verify(token, process.env.key);
        if (decoded) {
          const role = decoded.role;
          console.log('auth',decoded.role);
          req.body.role = role;
          next();
        } else {
          res.send("Wrong Token");
        }
      }
    } catch (e) {
      res.send({ msg: "Token Expired" });
    }
  } else {
    res.send({ msg: "Enter Token" });
  }
};

module.exports = {
  authenticate,
};
