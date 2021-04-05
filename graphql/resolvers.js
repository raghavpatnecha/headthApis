// similar to controller in nodejs
const history = require('../models/history');
const validator = require('validator');

module.exports = {
    hello() {
        return {
            text: 'hello krishna',
            views: 1245
        };
    },
    createHistory({ userInput }, req) {
        // const email=args.userInput.email;
        // const name=args.userInput.name;
        // const password=args.userInput.password;
        const mobile = userInput.mobile;
        const title = userInput.title;
        const description = userInput.description;
        const errors = [];
        if (!validator.isLength(mobile, { min: 10, max: 10 })) {
            errors.push({ message: 'phone number not valid.' });
        }
        if (validator.isEmpty(title)) {
            errors.push({ message: 'title not their' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            throw error;
        }
        console.log(mobile, " ", title, " ", description);
        if (!mobile || !title || !description) {
            const error = new Error('Invalid Request made');
            error.statusCode = 200;
            throw error;
        }
        const newhist = new history(mobile, title, description);
        newhist.save().then(res => {
            console.log(res);
            return {
                mobile: userInput.mobile,
                status: 201,
                msg: 'recorded history'
            }
        }).catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            return err;
            next(err);
        });
    }
}