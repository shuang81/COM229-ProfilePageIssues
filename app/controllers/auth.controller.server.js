import express from 'express';

// need passport 
import passport from 'passport';

// need to include the User Model for authentication
import User from '../models/users.js';
import userModel from '../models/users.js';
// import DisplayName Utility method
import { UserDisplayName } from '../utils/index.js';

// Display Functions
export function DisplayLoginPage(req, res, next){
    if(!req.user){
        return res.render('index', {title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: UserDisplayName(req) });
    }

    return res.redirect('/survey-list');
}

export function DisplayRegisterPage(req, res, next){
    if(!req.user){
        return res.render('index', {title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: UserDisplayName(req)});
    }

    return res.redirect('/survey-list');
}

// Processing Function
export function ProcessLoginPage(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if(err){
            console.error(err);
            res.end(err);
        }     
        
        if(!user){
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }

        req.logIn(user, function(err){
            if(err){
                console.error(err);
                res.end(err);
            }

            return res.redirect('/');

        })
        
    })(req, res, next);
}

export function ProcessRegisterPage(req, res, next){
    let newUser = new User({
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.firstName + " " + req.body.lastName
    });

    User.register(newUser, req.body.password, function(err){
        if(err){
            if(err.name == "UserExistsError"){
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', 'Registration Error')
            } else {
                console.error(err.name);
                req.flash('registerMessage', 'Server Error')
            }
            
            return res.redirect('/register');
        }

        return passport.authenticate('local')(req, res, function()
        {
            return res.redirect('/');
        });
    });
}

export function ProcessLogoutPage(req, res, next){
    req.logOut(function(err){
        if(err){
            console.error(err);
            res.end(err);
        }

        console.log("user logged out successfully");
    });

    res.redirect('/login');
}

// Profile Page
export function DisplayProfileEditPage(req, res, next){
    let id = req.params.id;

    userModel.findById(id, (err, user) => {
        if(err){
            
            console.error(err);
            res.end(err);
        }
        
        res.render('index', { title: 'Edit Profile', page: 'profile', users: users, displayName: UserDisplayName(req) });
    });    
}

export function ProcessProfileEditPage(req, res, next){
    let id = req.params.id;
    
    let newUser = userModel({
        _id: req.body.id,
        displayName: req.body.displayName,
        username: req.body.username,
        emailAddress: req.body.emailAddress
    });

    userModel.updateOne({_id: id }, newUser, (err, user) => {
        if(err){
            console.error(err);
            res.end(err);
        };

        res.redirect('/survey-list')
    } )
}