const company=require('../models/company');

exports.baseLogin=(req,res,next)=>{
    res.render('welcome');
}

exports.check=(req,res,next)=>{
    const id=req.body.username;
    const pass=req.body.password;
    if(id==='name')
    {
        res.redirect('controller');
    }
    else{
        res.render('fail');
    }
}

exports.welcome=(req,res,next)=>{
    //this is the way to get a cookie
    console.log(req.get('Cookie'));
    res.render('landing');
}

exports.register=(req,res,next)=>{ 
    res.render('register',{valid:' '});
}

exports.doRegister=(req,res,next)=>{
    const first=req.body.fname;
    const last=req.body.lname;
    const email=req.body.email;
    const password=req.body.password;
    if(!first||!last||!email||!password)
    {
        console.log("Request made was not having all the details required..");
        res.render('register',{valid:"Invalid format"});
    }
    console.log(first," ",last," ",email," ",password);
    const com=new company(first,last,email,password);
    com.save().then(result=>{
        //this is the way to set cookie
        res.setHeader('Set-Cookie','email='+email);
        res.redirect('/admin/controller');
    }).catch(err=>{
        console.log(err);
        res.render('register',{valid:err});
    });
}