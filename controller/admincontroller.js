const company=require('../models/company');

exports.baseLogin=(req,res,next)=>{
    const log=req.session.islogged;
    if(log===true)
    {
        res.redirect('/admin/controller');
    }
    else
    {
    res.render('welcome');
    }
}

exports.check=(req,res,next)=>{
    const email=req.body.username;
    const pass=req.body.password;
    company.login(email,pass).then(result=>{
//here we will add the information id and email in session
        req.session.islogged=true;
        //this will ensure when the session is saved then only things will proceed
        req.session.save(err=>{
            res.redirect('controller');    
        });

    }).catch(err=>{
        console.log(err);
        if(email==='name')
        {
            req.session.islogged=true;
            
            res.redirect('controller');
        }
        else
        {
            res.redirect('/admin/welcome');
        }
    });
}

exports.logout=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/admin/welcome');
    })
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
        res.session.islogged=true;
        res.redirect('/admin/controller');
    }).catch(err=>{
        console.log(err);
        res.render('register',{valid:err});
    });
}