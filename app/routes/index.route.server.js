import { Router } from "express";
import { displayAboutPage, 
    displayContactPage, 
    displayHomePage,
    displaySurveyPage,
    DisplayProfileEditPage,
    ProcessProfileEditPage
    } from "../controllers/index.controller.server.js";

const router = Router();

router.get('/', displayHomePage);
router.get('/home', displayHomePage);
router.get('/about', displayAboutPage);
router.get('/contact', displayContactPage);
router.get('/survey', displaySurveyPage);
// Profile Page
router.post('/profile/:id', ProcessProfileEditPage);
router.get('/profile/:id', DisplayProfileEditPage);

export default router;
