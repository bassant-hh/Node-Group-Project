import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { responseObj } from '../utils.js';

export const isLogin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(responseObj(401, "Unauthorized: Please login first")); 
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-token -refreshToken -password'); 
        
        if (!req.user) {
            return res.status(401).json(responseObj(401, "Unauthorized: User not found"));
        }
        next();
    } catch (error) {
        return res.status(401).json(responseObj(401, "Unauthorized: Invalid token"));
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json(responseObj(403, "Forbidden: Admins only"));
    }
};

export const isOwner = (req, res, next) => {
    if (req.user && req.user._id.toString() === req.params.id) {
        next();
    } else {
        res.status(403).json(responseObj(403, "Forbidden: You are not the owner"));
    }
};

export const haveAccess = async (req, res, next) => {
    try {
        const bookId = req.params.id; 
        const hasOrder = await Order.findOne({
            userId: req.user._id,
            'books.bookId': bookId,
            orderStatus: { $in: ['completed', 'processing'] },
            rentalEndDate : { $gt: new Date() }
        });

        if (hasOrder) {
            next();
        } else {
            res.status(403).json(responseObj(403, "Forbidden: You don't have access to this book"));
        }
    } catch (error) {
        next(error);
    }
};