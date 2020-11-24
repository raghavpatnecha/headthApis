const company = require('../models/company');
const resetpassword=require('../models/resetpassword');
const bcrypt = require('bcryptjs');
//importing third party mailer support
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const crypto=require('crypto');

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}));
var transport2=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'manjeet.singh.9723@gmail.com',
        pass:'eyecon@1'
    }
});


exports.baseLogin = (req, res, next) => {
    const log = req.session.islogged;
    if (log === true) {
        res.redirect('/admin/controller');
    }
    else {
        let msg=req.flash('error');
        if(msg.lenght>0)
        {
            msg=msg[0];
        }
        else
        {
            msg=null;
        }
        res.render('welcome', { msg: msg });
    }
}

exports.check = (req, res, next) => {
    const email = req.body.username;
    const pass = req.body.password;
    company.check(email).then(result => {
        let obj = result[0];
        obj = obj[0];
        if (obj.num > 0) {
            return company.login(email).then(result => {
                console.log(result);
                let obj = result[0];
                obj = obj[0];
                //this method of bcrypt package compares the password given with the hashed password and then returns a boolean result which is true or false
                bcrypt.compare(pass, obj.password).then(match => {
                    if (match) {
                        req.session.email = obj.email;
                        req.session.islogged = true;
                        //this will ensure when the session is saved then only things will proceed
                        req.session.save(err => {
                            res.redirect('controller');
                        });
                    }
                    else {
                        res.render('welcome', { msg: 'Password is incorrect' });
                    }
                }).catch(err => {
                    console.log(err);
                    res.redirect('/admin/welcome');
                })
            }).catch(err => {
                console.log(err);
                if (email === 'name') {
                    req.session.islogged = true;
                    res.redirect('controller');
                }
                else {
                    res.redirect('/admin/welcome');
                }
            });
        }
        else {
            res.render('welcome', { msg: 'Email does not exist' });
        }
    }).catch(err => {
        console.log(err);
        res.render('welcome', { msg: '' });
    })

}

exports.logout = (req, res, next) => {
    const log = req.session.islogged;
    if (log === true) {
        req.flash('error', 'Logout operation successfull');
        req.session.destroy((err) => {
            console.log(err);
            res.redirect('/admin/welcome');
        });
    }
    else {
        console.log("You need to login to use this feature....");
    }
}

exports.change=(req,res,next)=>{
    res.render('change');
}

exports.welcome = (req, res, next) => {
    //this is the way to get a cookie
    const log = req.session.islogged;
    if (log === true) {
        res.render('landing');
    }
    else {
        req.flash('error', 'Please Login first to use this route');
        res.redirect('/admin/welcome');
    }
}

exports.register = (req, res, next) => {
    // res.render('register',{valid:' '});
    const log = req.session.islogged;
    if (log === true) {
        res.redirect('/admin/controller');
    }
    else {
        res.render('register', { valid: ' ' });
    }
}

exports.doRegister = (req, res, next) => {
    const first = req.body.fname;
    const last = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

    if (!first || !last || !email || !password) {
        console.log("Request made was not having all the details required..");
        res.render('register', { valid: "Invalid format" });
    }
    company.check(email).then(result => {
        let obj = result[0];
        obj = obj[0];
        if (obj.num == 0) {
            return bcrypt.hash(password, 12).then(pass => {
                return pass;
            }).then(hashp => {
                console.log(first, " ", last, " ", email, " ", hashp);
                const com = new company(first, last, email, hashp);
                return com.save();
            }).then(result => {
                //this is the way to set cookie
                req.session.islogged = true;
                req.session.email = email;
                res.redirect('/admin/controller');
                var mailOptions={
                    from:'manjeet.singh.9723@gmail.com',
                    to:email,
                    subject:'Account created',
                    text:`<h1>Your account was successfully created now take a pill and chill</h1>`
                }; 
                transport2.sendMail(mailOptions,(err,info)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        console.log('Email sent : '+info.response);
                    }
                });
            }).catch(err => {
                console.log(err);
                res.render('register', { valid: err });
            });
        }
        else {
            res.render('register', { valid: 'The email already exists' });
        }
    }).catch(err => {
        console.log(err);
    });
}

exports.resetPassword=(req,res,next)=>{
    const email=req.body.email;
    if(!email)
    {
        console.log('Email is required');
        res.redirect('/admin/change');
    }
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
        {
            console.log(err);
            return res.redirect('/admin/change');
        }
        const token=buffer.toString('hex');
        company.check(email).then(c=>{
            let count=c[0];
            count=count[0];
            if(count.num>0)
            {
                let tt=Date.now()+3600000;
                let rest=new resetpassword(email,token,tt);
                rest.save().then(result=>{
                    let mailOptions={
                        from:'manjeet.singh.9723@gmail.com',
                        to:email,
                        subject:'Password reset request',
                        html:`<h1>Your request to change your password approved</h1>
                        <p><a href="http://localhost:5000/admin/${token}">Click here to reset</a></p>`
                    };
                    transport2.sendMail(mailOptions,(err,info)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        console.log('Email sent : '+info.response);
                    }
                });
                res.redirect('/admin/welcome');
                }).catch(err=>{
                    console.log(err);
                });
                res.redirect('/admin/welcome');    
            }
            else
            {
                console.log("No email with this adderess found");
                res.render('change',{msg:'Email not found'});
            }
        }).catch(err=>{
            console.log(err);
        })
    })
}
exports.confirmChange=(req,res,next)=>{
    const token=req.params.token;
    console.log(token);
    if(!token)
    {
        console.log("invalid request");
        res.render('fail');
    }
    resetpassword.search(token).then(result=>{
    let obj=result[0];
    obj=obj[0];
    let email=obj.email;
    console.log(email);
    let tt=Date.now()+3600000;
    console.log(obj.time);
    if(tt>parseInt(obj.time))
    {
        return resetpassword.delete(email,token);
    }
    else{
        res.render('<h1>Token expired please generate the request again</h1>');
    }
    }).then(rr=>{
        res.render('confirmChange',{email:email});
    }).catch(err=>{
        console.log(err);
        res.render('notoken');
    });
    //res.render('fail');
}
exports.finalChange=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    if(!email||!password)
    {
        res.render('fail');
        console.log("invalid request made");
    }
    bcrypt.hash(password,12).then(cryp=>{
        return company.alterPass(email,cryp);
    }).then(result=>{
        console.log("Password resetted to new password ",password);
        res.redirect('/admin/welcome');
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/admin/welcome');
    });
}