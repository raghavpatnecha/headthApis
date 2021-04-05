const db=require('../util/database');

module.exports=class accessRecord{
    constructor(email,mobile,reason)
    {
        this.email=email;
        this.mobile=mobile;
        this.reason=reason;
    }
    save()
    {
        return db.execute('INSERT INTO accessrecord (email,mobile,reason) VALUES (?,?,?)',[this.email,this.mobile,this.reason]);
    }
    static getHistory(email)
    {
        return db.execute('SELECT * FROM accessrecord WHERE email=(?)',[this.email]);
    }
    static getHistoryUser(mobile)
    {
        return db.execute('SELECT * FROM accessrecord WHERE mobile=(?)',[this.mobile]);
    }
}