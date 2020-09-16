const history = require('../models/history');
const dieseas = require('../models/dieseas');
const medicine = require('../models/medicine');
const allergy = require('../models/allergy');
const al2=require('../models/allergy');
const bcrypt = require('bcryptjs');

exports.addAllergy = (req, res, next) => {
    const mobile = req.body.mobile;
    const allergy = req.body.allergy;
    const triggers = req.body.triggers;
    console.log(mobile + " " + allergy + " " + triggers);
    if (!mobile || !allergy || !triggers) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const ale=new al2(mobile,allergy,triggers);
    ale.save().then(result=>{
        res.status(201).json({status:1,msg:"Alergy recorded"});
    }).catch(err=>{
        console.log(err);
        if(!err.statusCode)
        {
            err.statusCode=200;
        }
        next(err);
    });
}
exports.addHistory=(req,res,next)=>{
    const mobile=req.body.mobile;
    const title=req.body.title;
    const description=req.body.description;
    if(!mobile||!title||!description)
    {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const his=new history(mobile,title,description)
    his.save().then(result=>{
        res.status(201).json({status:1,msg:"History recorded"});
    }).catch(err=>{
        console.log(err);
        if(!err.statusCode)
        {
            err.statusCode=200;
        }
        next(err);
    });
}
exports.addMedicine=(req,res,next)=>{
    const mobile=req.body.mobile;
    const name=req.body.name;
    const purpose=req.body.purpose;
    const duration=req.body.duration;
    const dosage=req.body.dosage;
    if(!mobile||!name||!purpose||!duration||!dosage)
    {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const med=new medicine(mobile,name,purpose,duration,dosage);
    med.save().then(result=>{
        res.status(201).json({status:1,msg:"Medicine recorded"});
    }).catch(err=>{
        console.log(err);
        if(!err.statusCode)
        {
            err.statusCode=200;
        }
        next(err);
    });
}
exports.addDieseas=(req,res,next)=>{
    const mobile=req.body.mobile;
    const name=req.body.name;
    const details=req.body.details;
    
    if(!name||!mobile||!details)
    {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const die=new dieseas(mobile,name,details);
    die.save().then(result=>{
        res.status(201).json({status:1,msg:"Dieseas recorded"});
    }).catch(err=>{
        console.log(err);
        if(!err.statusCode)
        {
            err.statusCode=200;
        }
        next(err);
    });
}
exports.getDieseas=(req,res,next)=>{
    const mobile=req.body.mobile;
    if(!mobile||mobile.length<10)
    {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    dieseas.getDieseasByMobile(mobile).then(result=>{
        res.status(201).json({status:1,data:result[0]});
    }).catch(err=>{
        console.log(err);
        if(!err.statusCode)
        {
            err.statusCode=200;
        }
        next(err);
    });
}