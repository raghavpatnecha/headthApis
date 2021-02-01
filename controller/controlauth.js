const user = require('../models/user');
const emergency = require('../models/emergency');
const prescription = require('../models/prescription');
const report = require('../models/report');
const history = require('../models/history');
const dieseas = require('../models/dieseas');
const medicine = require('../models/medicine');
const allergy = require('../models/allergy');
const upgrade = require('../models/upgrade');
const notification = require('../models/notification');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
//this bcrypt library is used to hash the password
const bcrypt = require('bcryptjs');
const mime = require('mime');
const e = require('express');

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
    const level = "1";
    if (!name || !mobile || !height || !weight || !blood || !dob) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
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
    const u1 = new user(mobile, name, dob, height, weight, blood, level);
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
    if (!name || !mobile || !phone) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
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
exports.addImage64 = (req, res, next) => {
    let image = req.body.image_64;
    let name = req.body.name;
    let type2 = req.body.type;
    name = name + type2;
    console.log(image.substring(0,20)," ",name," ",type2);
    if (!name || !type2 || !image) {
        const err = new Error('Invalid Request');
        err.statusCode = 200;
        throw err;
    }
    image = image;
    // console.log(image);
    let imgB64Data = decodeBase64Image(image);
    let imageBuffer = imgB64Data.data;
    //let extension = mime.extension(type);
    let fileName = name;
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
    res.status(201).json({status:1,name:fileName,msg:"data inserted"});
}
exports.addPrescription = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }

    let mobile = req.body.mobile;
    let title = req.body.title;
    let date = req.body.date;
    let doctor = req.body.doctor;
    let observation = req.body.observation;
    let image=req.body.imagePath;

    if (!mobile || !title || !date || !observation || !image) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    console.log(mobile + " " + title + " " + date + " " + doctor + " " + observation);
    prescription.saveIt(mobile, title, date, image, doctor, observation).then(result => {
        t1 = "Prescription added " + title;
        var date2 = new Date();
        let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
        c1 = "A prescription was added on " + dd + " with observer name " + doctor;
        addNotification(t1, c1, mobile);
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
    });
}

function decodeBase64Image(dataString) {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        const err = new Error('Invalid input string');
        err.statusCode = 200;
        throw err;
    }
    // console.log(matches);
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}
exports.deleteData = (req, res, next) => {
    const file = req.body.file;
    if (!file) {
        const err = new Error('Invalid request..');
        err.statusCode = 200;
        throw err;
    }
    try {
        fs.unlink('./images/' + file, (err) => {
            if (err) {
                console.log(err);
                res.status(200).json({ status: 0, msg: "Image is not deleted" });
            }
            else {
                console.log("data is deleted");
                res.status(201).json({ status: 1, msg: "data deletion successfull" });
            }
        })
    }
    catch (err) {
        console.log(err);
        const error = new Error('Invalid and not working');
        error.statusCode = 422;
        throw error;
    }
}
exports.addReport = (req, res, next) => {
    const title = req.body.title;
    const observer = req.body.observer;
    const date = req.body.date;
    const detail = req.body.detail;
    const mobile = req.body.mobile;
    // const data = req.body.data;
    const fileName = req.body.filename;
    const typeF = req.body.type;
    const category = req.body.category;
    // let file = name + typeF;
    if (!title || !observer || !date || !detail || !mobile.length == 10 || !category || !typeF || !fileName) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    //console.log(data);
    console.log(title + " " + observer + " " + detail + " " + date + " " + fileName + " " + typeF + " " + mobile + " " + category);
    const entry = new report(title, observer, detail, date, fileName, typeF, mobile, category);
    entry.save().then(result => {
        t1 = "Report added " + title;
        var date2 = new Date();
        let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
        c1 = "A report was added on " + dd + " with observer name " + observer;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Report inserted successfully' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getReports = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || !mobile.length == 10) {
        const err = new Error("Please supply a valid mobile number");
        err.statusCode = 200;
        throw err;
    }
    report.getReport(mobile).then(reports => {
        res.status(201).json({ status: 1, data: reports[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getTopReports = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || !mobile.length == 10) {
        const err = new Error("Please supply a valid mobile number");
        err.statusCode = 200;
        throw err;
    }
    report.getReportTop(mobile).then(reports => {
        res.status(201).json({ status: 1, data: reports[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
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
exports.getPrescriptions = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }
    const mobile = req.body.mobile;
    if (!mobile) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    prescription.getAllById(mobile).then(pres => {
        res.status(201).json({ status: 1, data: pres[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
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
    if (!mobile) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    console.log(mobile);
    user.getProfile(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getLevel = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    //console.log(mobile);
    user.getProfile(mobile).then(result => {
        let access = result[0];
        let item = access[0];
        console.log(item.level);
        res.status(201).json({ status: 1, accessLevel: item.level });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
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
    if (!mobile) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    console.log(mobile);
    if (!mobile) {
        const error = new Error("Mobile number needs to be specified");
        error.statusCode = 200;
        throw error;
    }
    emergency.getEmergencyContacts(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
exports.updateProfile = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        const error = new Error('Some Errors are their');
        error.statusCode = 422;
        error.data = errors.array
        throw error;
    }
    const mobile = req.body.mobile;
    const name = req.body.name;
    const height = req.body.height;
    const weight = req.body.weight;
    const dob = req.body.dob;
    const blood = req.body.blood;
    if (!name || !mobile || !height || !weight || !blood || !dob) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    user.updateProfile(mobile, name, height, weight, dob, blood).then(result => {
        t1 = "Profile Updated ";
        var date2 = new Date();
        let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
        c1 = "A profile was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Profile updated successfully" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
exports.updateEmergency = (req, res, next) => {
    const errors = validationResult(req);

    const name = req.body.name;
    const phone = req.body.phone;
    const rec_id = req.body.rec_id;
    const mobile = req.body.mobile;
    console.log(name, " ", phone, " ", rec_id, " ", mobile);
    if (!name || !phone || !rec_id || !mobile) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    if (phone.length < 10) {
        const error = new Error('Phone Number Invalid');
        error.statusCode = 200;
        throw error;
    }
    emergency.updateEmergency(rec_id, name, phone, mobile).then(result => {
        t1 = "Emergency Contacts Updated ";
        var date2 = new Date();
        let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
        c1 = "A emergency contacts was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Emergency Contact updated" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.deleteEmergency = (req, res, next) => {
    const rec_id = req.body.rec_id;
    console.log("record id being deleted is :-", rec_id);
    if (!rec_id) {
        const err = new Error("Invalid request");
        err.statusCode = 200;
        throw err;
    }
    emergency.deleteEmergency(rec_id).then(result => {
        res.status(201).json({ status: 1, msg: 'Emergency Contact Deleted' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.saveSingleEmergency = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const mobile = req.body.mobile;
    console.log(name + " " + phone + " " + mobile);
    if (!name || !phone || !mobile) {
        const err = new Error("Invalid Request please correct the data");
        err.statusCode = 200;
        throw err;
    }
    const newemer = new emergency(mobile, name, phone);
    newemer.save().then(result => {
        return emergency.getRecordId(phone);
    }).then(result => {
        console.log(result);
        res.status(200).json({ status: 1, msg: 'record inserted', rec_id: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.frontPrescription = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length != 10) {
        const err = new Error("A valid Phone number is required.");
        err.statusCode = 200;
        throw err;
    }
    prescription.getFrontPres(mobile).then(pres => {
        res.status(201).json({ status: 1, data: pres[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.qrScanner = (req, res, next) => {
    const mobile = req.body.mobile;
    const accesslevel = req.body.level;
    if (!mobile || !accesslevel) {
        err.statusCode = 200;
        throw err;
    }
    if (accesslevel === '2') {
        let pf, re, pre, med, die, all, his;
        user.getProfile(mobile).then(result => {
            pf = result[0];
            return report.getReport(mobile);
        }).then(rep => {
            re = rep[0];
            return prescription.getAllById(mobile);
        }).then(pre2 => {
            pre = pre2[0];
            return medicine.getMedicines(mobile);
        }).then(meds => {
            med = meds[0];
            return history.getHistoryByMobile(mobile);
        }).then(hiss => {
            his = hiss[0];
            return dieseas.getDieseasByMobile(mobile);
        }).then(dies => {
            die = dies[0];
            return allergy.getAllergyByMobile(mobile);
        }).then(alls => {
            all = alls[0];
            return emergency.getEmergencyContacts(mobile);
        }).then(emer => {
            t1 = "Qr Scanned ";
            var date2 = new Date();
            let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
            c1 = "Your Qr Code was scanned " + dd;
            addNotification(t1, c1, mobile);
            res.status(201).json({ status: 1, profile: pf, reports: re, precriptions: pre, emergency: emer[0], medicine: med, dieseas: die, allergy: all, history: his });
        }).catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        });
    }
    else if (accesslevel === '1') {
        let pf, med, all, die, eme;
        user.getProfile(mobile).then(result => {
            pf = result[0];
            pf = pf[0];
            return emergency.getEmergencyContacts(mobile);
        }).then(emer => {
            eme = emer[0];
            return medicine.getMedicines(mobile);
        }).then(mob => {
            med = mob[0];
            return allergy.getAllergyByMobile(mobile);
        }).then(alle => {
            all = alle[0];
            return dieseas.getDieseasByMobile(mobile);
        }).then(dis => {
            die = dis[0];
            t1 = "Qr Scanned ";
            var date2 = new Date();
            let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
            c1 = "Your Qr Code was scanned " + dd;
            addNotification(t1, c1, mobile);
            res.status(201).json({ status: 2, profile: pf, emergency: eme, dieseas: die, allergy: all, medicines: med });
        }).catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        });
    }
    else {
        res.status(201).json({ status: 0, msg: "invalid request" });
    }
}
exports.deletePres = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;
    let files = req.body.path;
    console.log(id, " ", files);
    if (!id || !files || !mobile) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0 || files.length <= 0) {
        const err = new Error("No prescriptions to be deleted...");
        err.statusCode = 200;
        throw err;
    }
    else {
        let s = 0;
        for (i = 0; i < id.length; i++) {
            let item = id[i];
            s = i;
            prescription.deletePres(item.id).then(result => {

                let item_image = files[s];
                console.log(item_image.path);
                fs.unlink('./images/' + item_image.path, (err) => {
                    if (err) {
                        console.log(err);
                        // res.status(200).json({status:0,msg:"Image is not deleted"});
                    }
                    else {
                        console.log("data is deleted");
                        // res.status(201).json({status:1,msg:"data deletion successfull"});
                    }
                })
                // return clearImage(item_image.path);
            }).then(result => {
                console.log("all ok image deleted");
            }).catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 200;
                }
                next(err);
            })
        }
        t1 = "Report deleted ";
        var date2 = new Date();
        let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
        c1 = "A report was deleted on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "All marked prescriptions deleted" });
    }
}
exports.deleteReports = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;
    let files = req.body.path;
    console.log(files);
    if (!id || !files) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0 || files.length <= 0) {
        const err = new Error("No prescriptions to be deleted...");
        err.statusCode = 200;
        throw err;
    }
    else {
        let s = 0;
        for (i = 0; i < id.length; i++) {
            let item = id[i];
            report.deleteReport(item.id).then(result => {
                s = i;
                let item_image = files[s];
                fs.unlink('./images/' + item_image.path, (err) => {
                    if (err) {
                        console.log(err);
                        // res.status(200).json({status:0,msg:"Image is not deleted"});
                    }
                    else {
                        console.log("data is deleted");
                        // res.status(201).json({status:1,msg:"data deletion successfull"});
                    }
                })
                // return clearImage(item_image.path);
            }).then(result => {
                console.log("all ok image deleted");
            }).catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 200;
                }
                next(err);
            })
        }
        t1 = "Prescription deleted ";
        var date2 = new Date();
        let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
        c1 = "A prescription was deleted on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "All marked prescriptions deleted" });
    }
}
exports.updateReport = (req, res, next) => {

}
exports.upgradeProfile = (req, res, next) => {
    const mobile = req.body.mobile;
    const request = req.body.request;
    if (!mobile || !request) {
        const error = new Error("invalid request");
        error.statusCode = 200;
        throw error;
    }
    const uu = new upgrade(mobile, request);
    uu.save().then(ress => {
        res.status(201).json({ status: 1, msg: "Requested the admin to elevate your status" });
    }).catch(err => {
        console.log(err);
        if (err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.checkProfilestatus = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile) {
        const error = new Error("invalid request");
        error.statusCode = 200;
        throw error;
    }
    upgrade.check(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => { console.log(err) });
}
function addNotification(title, content, mobile) {
    var date = new Date();
    let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    const N = new notification(mobile, title, content, dd);
    N.save().then(res => {
        console.log("Notification added successfully");
    }).catch(err => {
        console.log(err);
    });
}