const express=require('express');
const admincontroller=require('../controller/admincontroller');
//this checks if the user is logged in or not 
const isAuth=require('../middleware/is-auth');

const router=express();

router.get('/welcome',admincontroller.baseLogin);

router.post('/confirm',admincontroller.check);

router.get('/controller',isAuth,admincontroller.welcome);

router.get('/register',admincontroller.register);

router.post('/logout',isAuth,admincontroller.logout);

router.post('/newCompany',admincontroller.doRegister);

//csrf=cross site request forgery

module.exports=router;