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

router.post('/getImage',controlauth.addImage);
//route to get prescriptions by mobile number which is unique
router.post('/getprescriptions',[body('mobile').trim().isLength({min:10}).withMessage("please Enter a valid phone number")],controlauth.getPrescriptions);

router.post('/updateUser', [
    body('mobile').trim().isLength({min:10}),
    body('name').trim().isLength({min:3}),
    body('height').trim().isLength({min:2}),
    body('weight').trim().isLength({min:2}),
    body('blood').trim().isLength({min:1})
] , controlauth.updateProfile);

router.post('/updateEmergency',[
    body('phone').trim().isLength({min:10}).withMessage("Please Send a valid number"),
    body('rec_id').trim().isLength({min:1}).withMessage("Id cannot be null")
],controlauth.updateEmergency);
//route to add a single emergency cotact
router.post('/singleEmergency',controlauth.saveSingleEmergency);
//route to get the main layout prescription max length 3
router.post('/frontpres',controlauth.frontPrescription);

module.exports=router;