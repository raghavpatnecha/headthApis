const express=require('express');
const admincontroller=require('../controller/admincontroller');

const router=express();

router.get('/welcome',admincontroller.baseLogin);

router.post('/confirm',admincontroller.check);

router.get('/controller',admincontroller.welcome);

router.get('/register',admincontroller.register);

router.post('/logout',admincontroller.logout);

router.post('/newCompany',admincontroller.doRegister);

module.exports=router;