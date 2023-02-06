const express = require("express");
const userRouter = express();
userRouter.use(express.json());

require("dotenv").config();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { UserModel } = require("../model/user.model");
const { authenticate } = require("../middlewares/authenticate");
const { authorise } = require("../middlewares/authorization");

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.send("Error in Signup");
      } else {
        const user = new UserModel({ name, email, password: hash, role });
        await user.save();
        res.send("Signup Successfull");
      }
    });
  } catch (e) {
    console.log("Err", e);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, decoded) => {
        if (decoded) {
          const token = jwt.sign({ role: user[0].role }, process.env.key, {
            expiresIn: "60s",
          });
          const r_token = jwt.sign({ role: user[0].role }, process.env.r_key, {
            expiresIn: "300s",
          });
          res.send({
            msg: "Login Successfull",
            token: token,
            refresh_token: r_token,
          });
        } else {
          res.send({ msg: "Wrong Password" });
        }
      });
    } else {
      res.send({ msg: "Wrong Credentials" });
    }
  } catch (e) {
    console.log("err", e);
  }
});

userRouter.get("/getnewtoken",(req,res)=>{
  const r_token=req.headers.auth?.split(" ")[1]
  if(!r_token){
    return res.send("Enter Refresh Token")
  }
  try{
    const decoded=jwt.verify(r_token,process.env.r_key)
    if(decoded){
      const token = jwt.sign({ role: decoded.role }, process.env.key, {
        expiresIn: "60s",
      });
      res.send({msg:'New Token Generated',token:token})
    }else{
      res.send({msg:'Wrong Token'})
    }
  }catch(e){
    res.send({msg:'Refresh Token Expired'});
  }

})

userRouter.use(authenticate)
userRouter.post("/logout", async (req, res) => {
  const token = req.headers.auth?.split(" ")[1];
  if (!token) {
    res.send({ msg: "Enter Token" });
  } else {
      const blacklisted = JSON.parse(
        fs.readFileSync("./blacklist.json", "utf-8")
      );
      blacklisted.push(token);
      fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisted));
      res.send({ msg: "Logout" });
  }
});

userRouter.get("/goldrate",authenticate,(req,res)=>{
  res.send({msg:'/goldrate accessible'})
})

userRouter.get("/userstats",authorise(["manager"]),(req,res)=>{
  res.send({msg:'/userstats accessible'})
})

module.exports = { userRouter };
