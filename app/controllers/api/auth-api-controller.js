import passport from 'passport';
import userModel from '../../models/users.js';
import { GenerateToken } from "../../utils/index.js";


export function processLogin(req, res, next){
    passport.authenticate('local', (err, user, info) => {
        // are there any server errors?
        if(err){
            console.error(err);
            res.end(err);
        }

        // are there any login errors?
        if(!user){
            return res.json({success: false, msg: 'ERROR: Authentication Failed'});
        }

        // no problems -  we have a good username and password
        req.logIn(user, (err) => {
            // are there any db errors?
            if (err){
                console.error(err);
                res.end(err);
            }

            const authToken = GenerateToken(user);

            return res.json({
                success: true,
                msg: 'User Logged In Successfully',
                user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    emailAddress: user.emailAddress
                },
                token: authToken
            })
        })
    })(req, res, next);
}

export function processRegistration(req, res, next) {
    //Instantiate a new user object
    let newUser = new userModel({
        ...req.body //Javascript destructing
    });

    userModel.register(newUser, req.body.password, (err) => {
        // error validations
        if(err){
            if(err.name === 'UserExistsError'){
                console.error('ERROR: User Already Exists!')
            }
            
            console.log(err);

            return res.json({success: false, msg: 'ERROR: Registration Failed!'})
        }

        // all ok - user has been registered
        return res.json({success: true, msg: 'User Registered Successfully'});
    })
}

export function processLogout(req, res, next){
    req.logOut((err) => {
        if(err){
            console.error(err);
            res.end(err);
        }

        console.log('User Logged Out');
    });

    res.json({success: true, msg: 'User logged out successfully'});
}

// Profile Page
export function GetProfile(req, res, next){
    userModel.find((err, usersCollection)=>{
        if(err){
            console.error(err);
            res.end(err);
        }

        res.json({success: true, msg: 'Success', user: usersCollection, user: req.user})
    });
}

export function Get(req, res, next){
    let id = req.params.id;

    userModel.findById(id, (err, user) => {
        if(err){
            console.error(err);
            res.end(err);
        }

        res.json({success: true, msg: 'Success', user: user , user: req.user })
    });
}

export function EditProfile(req, res, next){
    let id = req.params.id;

    let updatedUser = new userModel({
        "_id": id,
        ...req.body
    });

    userModel.updateOne({_id: id}, updatedUser, (err) => {
        if(err){
            console.error(err);
            res.end(err);
        }

        res.json({success: true, msg: 'Updated Successfully', updatedUser });
    })
}