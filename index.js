const express=require("express")
const app=express()
app.use(express.json())

require("dotenv").config()

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


app.get("/",(req,res)=>{
    res.send("Welcome")
})

const { userRouter } = require("./routes/userRoute")
app.use("/",userRouter)

const { connection } = require("./config/db")
app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log('Connected to DB');
        console.log(`Running at ${process.env.port}`);

    }catch(e){
        console.log('Err',e);
    }
})