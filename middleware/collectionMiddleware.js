import { responseObj } from './../utils.js';

export const pagination = (req,_,next) => {
    
    if( ! req.query.page || req.query.page.search(/^\d{1,9}$/) == -1 ) {
        req.page = 1;
    }else {
        req.page = req.query.page;   
    }
    
    next();
};

export const sort = (req,_,next) => {
    if( req.query.sort ) {
        req.query.sort = req.query.sort.toLowerCase();
        if( ['asc','desc'].indexOf(req.query.sort) == -1 ) req.sort = 'asc';
    }else {
        req.sort = 'asc';
    }
    
    next();
};

export const sortBy = (fields) => {
    return (req,_,next) => {
        if( ! req.query.sortby || fields.indexOf(req.query.sortby) == -1 ) {
            req.sortby = fields[0];
        }else {
            req.sortby = req.query.sortby;
        }
        
        next();
    };
};

export const search = (req,res,next)  => {
    if( req.query.s && req.query.s.search(/^[a-zA-Z0-9 ]{1,50}$/) == -1 ) {
        res.status(400).json(responseObj(400,"Invalid Search Query"));
    }else {
        next();
    }
};