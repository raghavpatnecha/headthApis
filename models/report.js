const db = require('../util/database');

module.exports = class Report {
    constructor(title, observer, details, date, link, type, mobile,category) {
        this.title = title;
        this.observer = observer;
        this.details = details;
        this.date = date;
        this.link = link;
        this.type = type;
        this.mobile = mobile;
        this.category=category;
    }
    save() {
        return db.execute('INSERT INTO reports (title,observer,details,date,link,type,mobile,category) VALUES (?,?,?,?,?,?,?,?)', [this.title, this.observer, this.details, this.date, this.link, this.type, this.mobile,this.category]);
    }
    static deleteReport(id)
    {
        return db.execute('DELETE FROM reports WHERE id=(?)',[id]);
    }
    static getReport(mobile) {
        return db.execute('SELECT * FROM reports WHERE mobile=(?) ORDER BY date DESC', [mobile]);
    }
    static getReverseReport(mobile) {
        return db.execute('SELECT * FROM reports WHERE mobile=(?) ORDER BY date ASC', [mobile]);
    }
    static getReportTop(mobile) {
        return db.execute('SELECT * FROM reports WHERE mobile=(?) ORDER BY date DESC LIMIT 3 ', [mobile]);
    }
    static updateReport(id,mobile,title,observer,details,date,link,type,category)
    {
        return db.execute('UPDATE reports SET mobile=(?),title=(?),observer=(?),details=(?),date=(?),link=(?),type=(?),category=(?) WHERE id=(?)',[mobile,title,observer,details,date,link,type,category,id]);
    }
};