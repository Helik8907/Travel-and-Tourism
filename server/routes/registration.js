const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");

router.get("/signup",(req,res)=>{

    console.log("sign up");
    res.render("/signup.ejs");
})
router.post("/signup",(req,res)=>{

    console.log("upadate succesfull");
    res.redirect("/");
})

router.get("/login",(req,res)=>{
      console.log("login");
      res.render("/login.ejs");
})

router.post("/login",(req,res)=>{
    console.log("login succesfull");
    res.redirect("/");
})

module.exports=router;
