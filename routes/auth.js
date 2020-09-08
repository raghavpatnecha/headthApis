const express=require('express');
const {body}=require('express-validator/check');
const controlauth=require('../controller/controlauth');

const router=express();

router.post('/newUser', [
    body('mobile').trim().isLength({min:10}),
    body('name').trim().isLength({min:3}),
    body('height').trim().isLength({min:2}),
    body('weight').trim().isLength({min:2}),
    body('blood').trim().isLength({min:1})
] , controlauth.registerUser);

router.post('/emergency',controlauth.emergencyAdder);

router.post('/prescription',controlauth.addPrescription);

router.post('/getprofile',[
    body('mobile').trim().not().isEmpty().withMessage('please enter a valid phone number')
],controlauth.getProfile);

router.post('/getemergency',[
    body('mobile').trim().isLength({min:10}).withMessage("please Enter a valid phone number")
],controlauth.getEmergency);

module.exports=router;