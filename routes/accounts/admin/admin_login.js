const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Admin = require('../../../model/accounts/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/',(req,res,next)=>{

    Admin.find({email_address:req.body.email_address})
    .exec()
    .then(admin => {
        if(admin.length < 1){
            return res.status(401).json({
                msg:'Admin Not Exit'
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


module.exports = router