const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Admin = require('../../../model/accounts/admin');
const Controller = require("../../../controllers/accounts/admin/users")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/',(req,res,next)=>{
console.log(req.body.email_address,"sdfghjkl;");
    Admin.find({email_address:req.body.email_address})
    .exec()
    .then(admin => {
        console.log(admin);
        if(admin.length < 1){
            return res.status(401).json({
                msg:'Admin Not Exist'
            })
        }
       
        bcrypt.compare(req.body.password,admin[0].password,(err,result)=>{
            if (!result) {
                return res.status(401).json({
                    msg:'password matching fail'
                })
            }
            if (result) {
                const token = jwt.sign({
                    "email_address":admin[0].email_address,

                },
                'this is dummy text',
                {
                    expiresIn:"24h"
                });
                res.status(200).json({
                    token:token,
                    msg:'Admin Login Successfully!'
                    // email_address:admin[0].email_address,
                })
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

router.post("/forget-password",Controller.forget_password)
router.post("/reset-password",Controller.update_password)


module.exports = router