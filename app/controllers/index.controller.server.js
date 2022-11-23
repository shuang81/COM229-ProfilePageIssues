import userModel from '../models/users.js';
import { UserDisplayName } from "../utils/index.js";

export function displayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: UserDisplayName(req)});
};

export function displayAboutPage(req, res, next) {
    res.render('index', { title: 'About', page: 'about', displayName: UserDisplayName(req)});
};

export function displayContactPage(req, res, next) {
    res.render('index', { title: 'Contact', page: 'contact', displayName: UserDisplayName(req)});
};

export function displaySurveyPage(req, res, next) {
    res.render('index', { title: 'Survey', page: 'survey'});
};

//Profile Page
export function DisplayProfileEditPage(req, res, next){
    let id = req.params.id;

    userModel.findById(id, (err, users) => {
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