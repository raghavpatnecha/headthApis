const express =require('express');
const reactcontroller=require('../controller/reactcontroller');
const {check}=require('express-validator');

const router=express();

router.post('/register',reactcontroller.register);

router.post('/login',reactcontroller.login);

router.post('/search',reactcontroller.searchFuntion);

router.post('/reports',reactcontroller.reportsFunction);

router.post('/prescriptions',reactcontroller.prescriptionFunction);

router.post('/raisealarm');

router.post('/getsetting');

router.post('/setsetting');

module.exports=router;