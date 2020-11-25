const express=require('express');
const admincontroller=require('../controller/admincontroller');
//this checks if the user is logged in or not 
const isAuth=require('../middleware/is-auth');
const {check} =require('express-validator/check');

const router=express();

router.get('/welcome',admincontroller.baseLogin);

router.post('/confirm',check('username').isEmail().withMessage('Please enter a valid email'),admincontroller.check);

router.get('/controller',isAuth,admincontroller.welcome);

router.get('/register',admincontroller.register);

router.post('/logout',isAuth,admincontroller.logout);

router.post('/register',[check('email').isEmail().withMessage('Please enter a valid email'),
check('password').trim().isLength({min:8,max:15}).withMessage('Password must be 8 digit long and less then 15 digits'),
check('cpassword').custom((value,{ req })=>{
    if(value===req.body.password)
    {
        return true;
    }
    throw new Error('Passwords have to match');
}),
check('fname').isLength({min:1}).withMessage('First name must be their'),
check('lname').isLength({min:1}).withMessage('First name must be their')]
,admincontroller.doRegister);

router.get('/change',admincontroller.change);

router.post('/changePassword',admincontroller.resetPassword);
//csrf=cross site request forgery
//this route is used to reset the password of the token generated and is valid for 1 hour
router.get('/:token',admincontroller.confirmChange);

router.post('/confirmChange',admincontroller.finalChange);
module.exports=router;

