const user = require('../models/user');
const emergency = require('../models/emergency');
const prescription = require('../models/prescription');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');
//this bcrypt library is used to hash the password
const bcrypt = require('bcryptjs');
const mime = require('mime');

exports.registerUser = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error("Invalid data is provided please chech the data");
        error.statusCode = 422;
        throw error;
    }
    const name = req.body.name;
    const mobile = req.body.mobile;
    const height = req.body.height;
    const weight = req.body.weight;
    const blood = req.body.blood;
    const dob = req.body.dob;

    //a demonstration on how to use bcrypt
    bcrypt.hash(mobile, 15).then(hashedpw => {
        console.log(hashedpw);
    }).catch(err => {
        console.log(err);
    });

    console.log(name);
    console.log(mobile);
    console.log(height);
    console.log(weight);
    console.log(blood);
    console.log(dob);
    const u1 = new user(mobile, name, dob, height, weight, blood);
    u1.save().then(result => {
        console.log('data entered');
        res.status(201).json({
            status: 1,
            msg: name
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.emergencyAdder = (req, res, next) => {
    let name = req.body.names.split(",");
    let phone = req.body.phones.split(",");
    let mobile = req.body.mobile;
    console.log(name);
    console.log(phone);
    console.log(mobile);
    let check = true;
    for (i = 0; i < name.length; i++) {
        const u1 = new emergency(mobile, name[i], phone[i]);
        u1.save().then(result => {
            console.log(result);
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 404;
            }
            check = false;
            next(err);
        });
    }
    if (check) {
        res.status(201).json({
            status: 1,
            msg: "Emergency contacts inserted successfully"
        });
    }
    else {
        res.status(404).json({
            status: 0,
            msg: "Some Internal error maybe your data is invalid"
        });
    }
}
exports.addImage = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }
    if (!req.file) {
        const error = new Error("No file found");
        error.statusCode = 422;
        throw error;
    }
    let image = req.file.path;
    console.log(image);
    res.status(201).json({ image: image });
}
exports.addPrescription = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }
    // if(!req.file)
    // {
    //     const error=new Error("No file found");
    //     error.statusCode=422;
    //     throw error;
    // }
    let mobile = req.body.mobile;
    let title = req.body.title;
    let date = req.body.date;
    let doctor = req.body.doctor;
    let observation = req.body.observation;
    let image = req.body.image_64;
    let name=req.body.name+'.jpeg';
    console.log(mobile + " " + title + " " + date + " " + doctor + " " + observation);
    image = 'data:image/jpeg;base64,' + image;
    console.log(image);
    let imgB64Data = decodeBase64Image(image);
    let imageBuffer = imgB64Data.data;
    let type = imgB64Data.type;
    //let extension = mime.extension(type);
    let fileName = 'image.jpeg';
    fileName=name;
    image = fileName;
    try {
        fs.writeFileSync('./images/' + fileName, imageBuffer, 'utf8');
    }
    catch (err) {
        console.error(err);
        const error = new Error("Not working");
        error.statusCode = 422;
        throw error;
    }
    // let image=req.file.path;
    // console.log(image);

    // let p1=new prescription(mobile,title,date,image,doctor,observation);
    // p1.save().then(result=>{
    //     res.status(201).json({
    //         status:1,
    //         msg:"Everything fine"
    //     });
    // }).catch(err=>{
    //     if(!err.statusCode)
    //     {
    //         err.statusCode=200;
    //     }
    // next(err);
    // });
    prescription.saveIt(mobile, title, date, image, doctor, observation).then(result => {
        res.status(201).json({
            status: 1,
            msg: "Prescription Uploaded Successfully"
        });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}

function decodeBase64Image(dataString) {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        const err = new Error('Invalid input string');
        err.statusCode = 200;
        throw err;
    }
    console.log(matches);
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

exports.updatePrescription = (req, res, next) => {
    const mobile = req.body.mobile;
    const id = req.body.id;
    const title = req.body.title;
    const date = req.body.date;
    const doctor = req.body.doctor;
    const observation = req.body.observation;
    const image = req.body.image;
    if (req.file) {
        image = req.file.path;
    }
    if (!image) {
        const err = new Error("No image provided");
        error.statusCode = 201;
        throw err;
    }
    if (image != req.body.image) {
        //please configure this code this may not work properply right now
        clearImage(req.body.image);
    }
}
exports.getPrescriptions=(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }
    const mobile=req.body.mobile;
    prescription.getAllById(mobile).then(pres=>{
    res.status(201).json({status:1,data:pres[0]});
    }).catch(err=>{
        console.log(err);
        if(!err.statusCode)
        {
            err.statusCode=200;
        }
        next(err);
    })
}
exports.getProfile = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }
    const mobile = req.body.mobile;
    console.log(mobile);
    user.getProfile(mobile).then(result => {
        res.status(201).json(result[0]);
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
exports.getEmergency = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }
    const mobile = req.body.mobile;
    console.log(mobile);
    if (!mobile) {
        const error = new Error("Mobile number needs to be specified");
        error.statusCode = 200;
        throw error;
    }
    emergency.getEmergencyContacts(mobile).then(result => {
        res.status(201).json({ data: result[0] });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => { console.log(err) });
}