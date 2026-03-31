import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { responseObj } from './../utils.js';

import User from './../models/User.js';

const register = (req, res) => {
    //Check Valid Inputs
    if( req.body && req.body.username && req.body.firstName && req.body.lastName && req.body.email && req.body.password ) {
        
        /* Validate Inputs */
        if( req.body.username.search(/^[a-zA-Z0-9_]{5,}$/) == -1 ) {
            req.status(400).json(responseObj(400,"Username Must Be Atleast 5 Characters & Contains Alphanumric and Underscore Only"));
            return;
        }
        
        if( req.body.firstName.search(/^[a-zA-Z]{3,}$/) == -1 || req.body.lastName.search(/^[a-zA-Z]{3,}$/) == -1 ) {
            req.status(400).json(responseObj(400,"First and Last Name Must Be Only Alphabatical Characters & Atleast 3 Characters Each"));
            return;
        }
        
        if( req.body.email.search(/^[a-zA-Z_.]{5,}@[a-z]{3,}\.[a-z]{2,8}$/) == -1 ) {
            req.status(400).json(responseObj(400,"Invalid E-Mail Address"));
            return;
        }
        
        if( ! req.body.password.search(/^[a-zA-Z_.#@!%^&]{8,30}$/) ) {
            req.status(400).json(responseObj(400,"Password Must Be Atleast 8 Character & Must Contain Only Aplhabatical, Numbers Or (_,!,@,#,$,%,^,&) "));
            return;
        }
        
        const newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hash(req.body.password,10)
        });
        
            
        
    }else {
        req.status(400).json(responseObj(400,"Invalid Inputs"));
    }
};

const login = (req, res) => {
    res.status(200).json({ message: "User login" });
};

const refresh_token = (req, res) => {
    if( ! req.body || ! req.body.refresh_token ) {
        
    }
};

const logout = (req, res) => {
    
};

const update_info = (req, res) => {
    
};

export default {
    register,
    login,
    refresh_token,
    logout,
    update_info
};