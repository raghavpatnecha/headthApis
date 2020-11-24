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

router.get('/change',admincontroller.change);

router.post('/changePassword',admincontroller.resetPassword);
//csrf=cross site request forgery
//this route is used to reset the password of the token generated and is valid for 1 hour
router.get('/:token',admincontroller.confirmChange);

router.post('/confirmChange',admincontroller.finalChange);
module.exports=router;

