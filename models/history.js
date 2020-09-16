const db = require('../util/database');

module.exports = class History {
    constructor(mobile, title, description) {
        this.mobile = mobile;
        this.title = title;
        this.description = description;
    }
    save()
    {
        return db.execute('INSERT INTO history (mobile,title,description) VALUES (?,?,?)',[this.mobile,this.title,this.description]);
    }
    static getHistoryByMobile(mobile)
    {
        return db.execute('SELECT * FROM history WHERE mobile=(?)',[mobile]);
    }
}