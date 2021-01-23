const db=require('../util/database');
module.exports=class Notification{
    constructor(mobile,title,content,date)
    {
        this.mobile=mobile;
        this.content=content;
        this.date=date;
        this.title=title;
    }
    save()
    {
        return db.execute('INSERT INTO notification (mobile,date,content,title) VALUES (?,?,?,?)',[this.mobile,this.date,this.content,this.title]);
    }
    static getNotification(mobile)
    {
        return db.execute('SELECT * FROM notification WHERE mobile=(?)',[mobile]);
    }
    static deleteNotification(id)
    {
        return db.execute('DELETE FROM notification WHERE id=(?)',[id]);
    }
    static updateNotification(id)
    {
        return db.execute('UPDATE notification SET status="read" WHERE id=(?)',[id]);
    }
}