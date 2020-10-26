const history = require('../models/history');
const dieseas = require('../models/dieseas');
const medicine = require('../models/medicine');
const allergy = require('../models/allergy');
const al2 = require('../models/allergy');
const notification = require('../models/notification');
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
    const ale = new al2(mobile, allergy, triggers);
    ale.save().then(result => {
        t1 = "Allergy added " + allergy;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A allergy was added on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Allergy recorded" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.addHistory = (req, res, next) => {
    const mobile = req.body.mobile;
    const title = req.body.title;
    const description = req.body.description;
    if (!mobile || !title || !description) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const his = new history(mobile, title, description)
    his.save().then(result => {
        //  console.warn("you accessed me");
        t1 = "History added " + title;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A history was added on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "History recorded" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.addMedicine = (req, res, next) => {
    const mobile = req.body.mobile;
    const name = req.body.name;
    const purpose = req.body.purpose;
    const duration = req.body.duration;
    const dosage = req.body.dosage;
    if (!mobile || !name || !purpose || !duration || !dosage) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const med = new medicine(mobile, name, purpose, duration, dosage);
    med.save().then(result => {
        t1 = "Medicine added: " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A Medicine was added on " + dd + " .For the Duration of " + duration;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Medicine recorded" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.addDieseas = (req, res, next) => {
    const mobile = req.body.mobile;
    const name = req.body.name;
    const details = req.body.details;

    if (!name || !mobile || !details) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const die = new dieseas(mobile, name, details);
    die.save().then(result => {
        t1 = "Dieseas added: " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A dieseas was added on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Dieseas recorded" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getDieseas = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    dieseas.getDieseasByMobile(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getMedicines = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    medicine.getMedicines(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getallergy = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    allergy.getAllergyByMobile(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getHistory = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    history.getHistoryByMobile(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateAllergy = (req, res, next) => {
    const id = req.body.id;
    const allergy2 = req.body.allergy;
    const triggers = req.body.triggers;
    const mobile = req.body.mobile;
    if (!id || !allergy2 || !triggers) {
        const err = new Error("Valid arguments not passed");
        err.statusCode = 200;
        throw err;
    }
    allergy.updateAllergy(id, allergy2, triggers).then(result => {
        t1 = "Allergy updated:  " + allergy2;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A allergy was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Allergy Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateHistory = (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const mobile = req.body.mobile;
    const description = req.body.description;
    if (!id || !title || !description) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    history.updateHistory(id, title, description).then(result => {
        t1 = "History updated:  " + title;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A history was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'History Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateMedicine = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const mobile = req.body.mobile;
    const purpose = req.body.purpose;
    const duration = req.body.duration;
    const dosage = req.body.dosage;
    if (!id || !name || !purpose || !duration || !dosage) {
        const err = new Error("Invalid Request.....");
        err.statusCode = 200;
        throw err;
    }
    medicine.updateMedicine(id, name, purpose, dosage, duration).then(result => {
        t1 = "Medicine updated:  " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A medicine was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Medicine Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateDieseas = (req, res, next) => {
    const id = req.body.id;
    const mobile = req.body.mobile;
    const name = req.body.name;
    const details = req.body.details;
    if (!id || !name || !details) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    dieseas.updateDiesease(id, name, details).then(result => {
        t1 = "Diesease updated:  " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A diesease was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Dieseas Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.deleteMedicine = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;
    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            medicine.deleteMedicine(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "Medicines deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in medicines are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.deleteAllergy = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;
    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            allergy.deleteAllergy(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "Allergies deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in allergies are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.deleteHistory = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;

    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            history.deleteHistory(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "History deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in history are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.deleteDieases = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;

    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            dieseas.deleteDieseas(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "Dieseases deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in dieseases are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.getNotification = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    notification.getNotification(mobile).then(result => {
        res.status(201).json({ status: 1, obj: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
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