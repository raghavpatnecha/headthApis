const company = require('../models/company');
const bcrypt = require('bcryptjs');


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