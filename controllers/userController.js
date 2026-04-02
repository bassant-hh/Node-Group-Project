import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { responseObj , asyncHandler } from './../utils.js';

import User from './../models/User.js';

export const register = asyncHandler(async (req, res) => {
    //Check Valid Inputs
    if( req.body && req.body.username && req.body.firstName && req.body.lastName && req.body.email && req.body.password ) {
        
        /* Validate Inputs */
        if( req.body.username.search(/^[a-zA-Z0-9_]{5,}$/) == -1 ) {
            res.status(400).json(responseObj(400,"Username Must Be Atleast 5 Characters & Contains Alphanumric and Underscore Only"));
            return;
        }
        
        if( req.body.firstName.search(/^[a-zA-Z]{3,}$/) == -1 || req.body.lastName.search(/^[a-zA-Z]{3,}$/) == -1 ) {
            res.status(400).json(responseObj(400,"First and Last Name Must Be Only Alphabatical Characters & Atleast 3 Characters Each"));
            return;
        }
        
        if( req.body.email.search(/^[a-zA-Z_.]{5,}@[a-z]{3,}\.[a-z]{2,8}$/) == -1 ) {
            res.status(400).json(responseObj(400,"Invalid E-Mail Address"));
            return;
        }
        
        if( req.body.password.search(/^[a-zA-Z_.#@!%^&]{8,30}$/) == -1 ) {
            res.status(400).json(responseObj(400,"Password Must Be Atleast 8 Character & Must Contain Only Aplhabatical, Numbers Or (_,!,@,#,$,%,^,&) "));
            return;
        }
        
        const newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password,10),
            role: 'USER',
        });

        const token = jwt.sign({
            id: newUser._id, 
			username: newUser.username,
			role: 'USER'
		},process.env.JWT_SECRET,{
            expiresIn: 60 * 60 * 24
        });

        const refreshToken = jwt.sign({
            id: newUser._id,
            username: newUser.username,
            role: 'USER'
        },process.env.JWT_SECRET,{
            expiresIn: 60 * 60 * 24 * 7
        });

        newUser.token = token;
        newUser.refreshToken = refreshToken;

        await newUser.save();
        
		if( newUser ) {
			return res.status(201).json(responseObj(201,"User Created Successfully",{token,refreshToken}));
		}else {
			return res.status(400).json(responseObj(400,"Unexpected Error"));
		}
        
    }else {
        res.status(400).json(responseObj(400,"Invalid Inputs"));
    }
});

export const login = asyncHandler(async (req, res) => {
    if( req.body && (req.body.username || req.body.email) && req.body.password ) {
        
        const user = await User.findOne({
            $or: [{username: req.body?.username},{email: req.body?.email}]
        });
        
        if( user && req.body.password && await bcrypt.compare(req.body.password, user.password) ) {
            const token  = jwt.sign({
                id: user._id,
                username: user.username,
                role: user.role
            },process.env.JWT_SECRET);
            
            const refreshToken = jwt.sign({
                id: user._id,
                username: user.username,
                role: user.role
            },process.env.JWT_SECRET);
            
            user.token = token;
            user.refreshToken = refreshToken;
            
            await user.save();
            
            res.status(200).json(responseObj(200,"Logged In Successfully",{ token,refreshToken }));
        }else {
            res.status(400).json(responseObj(400,"Invalid Username/Email Or Password"));
        }
    }else {
        res.status(400).json(responseObj(400,"Invalid Inputs"));
    }
});

export const refresh_token = asyncHandler(async (req, res) => {
    if( req.body && req.body.refresh_token ) {
        const user = await User.find({where: {refreshToken: req.body.refresh_token}});
        
        if( user && user.refreshToken == req.body.refresh_token ) {
            const newToken = jwt.sign({
                username: user.username,
                role: user.role
            },process.env.JWT_SECRET);
            
            const newRefreshToken = jwt.sign({
                username: user.username,
                role: user.role
            },process.env.JWT_SECRET);
            
            user.token = newToken;
            user.refreshToken = newRefreshToken;
            
            await user.save();
            
            res.status(200).json(responseObj(200,"Token Refreshed Successfully",{token: newToken,refreshToken: newRefreshToken}));
        }else {
            res.status(400).json(responseObj(400,"Invalid Request"));
        }
    }else {
        res.status(400).json(responseObj(400,"Invalid Request"));
    }
});

export const logout = asyncHandler(async (req, res) => {
    if( req.user && req.user.id ) {
        const user = await User.findById(req.user.id);
        if( user ) {
            user.token = '';
            user.refreshToken = '';
            
            await user.save();
            
            res.status(200).json(responseObj(200,"Logged Out Successfully"));
        }else {
            res.status(404).json(responseObj(400,"Invalid Request"));
        }
    }else {
        res.status(400).json(responseObj(400,"Invalid Request"));
    }
});

export const update_info =asyncHandler( async (req, res) => {
    if( ! req.body ) {
        res.status(400).json(responseObj(400,"Invalid Inputs"));
        return;
    }
    
    const user = await User.findById(req.user.id);
    
    if( user ) {
        for(let field of ['username','email','role','firstName','lastName']) {
            if( req.body[field] ) {
                user[field] = req.body[field];
            }
        }
        
        if( req.body.password ) {
            const newPasswordHash = await bcrypt.hash(req.body.password,10);
            
            user.password = newPasswordHash;
        }
        
        await user.save();
        
        res.status(202).json(responseObj(202,"User Updated Successfully"));
    }else{
        res.status(400).json(responseObj(400,"Invalid Request"));
    }
});




export const update_reading_progress = async (req, res) => {
    const { bookId, currentPage, totalPages } = req.body;
    const userId = req.user?._id || req.body.userId; 

    if (bookId && currentPage && totalPages && userId) {
        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User Not Found" });

            let progress = user.readingProgress.find(p => p.bookId.toString() === bookId);

            if (!progress) {
                user.readingProgress.push({ bookId, lastPage: currentPage });
            } else {
                progress.lastPage = currentPage;
                if (currentPage >= totalPages && !progress.isCompleted) {
                    progress.isCompleted = true;
                    user.completedBooksCount = (user.completedBooksCount || 0) + 1;
                    if (user.completedBooksCount === 2) {
                        user.wallet.balance = (user.wallet.balance || 0) + 100;
                    }
                }
            }

            await user.save();
            return res.status(200).json({
                status: 200,
                message: "Progress Updated Successfully",
                data: { balance: user.wallet.balance, completedBooks: user.completedBooksCount }
            });
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error: error.message });
        }
    } else {
        return res.status(400).json({
            status: 400,
            message: "Missing Fields",
            debug: { hasBookId: !!bookId, hasPage: !!currentPage, hasTotal: !!totalPages, hasUser: !!userId }
        });
    }
};



