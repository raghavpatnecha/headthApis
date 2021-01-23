const db=require('../util/database');

module.exports= class Emergency{
    constructor(mobile,names,phones)
    {
        this.mobile=mobile;
        this.names=names;
        this.phones=phones;
    }
    save()
    {
        return db.execute('INSERT INTO emergency(mobile,name,phone) VALUES (?,?,?)',[this.mobile,this.names,this.phones]);
    }
    static getEmergencyContacts(mobile)
    {
        return db.execute('SELECT phone,name,rec_id FROM emergency WHERE mobile=(?)',[mobile]);
    }
    static updateEmergency(rec_id,name,phone,mobile)
    {
        return db.execute('UPDATE emergency SET name=(?),phone=(?),mobile=(?) WHERE rec_id=(?)',[name,phone,mobile,rec_id]);
    }
    static checkExistence(mobile)
    {
        return db.execute('SELECT COUNT(phone) AS god FROM emergency WHERE phone=(?)',[mobile]);
    }
    static deleteEmergency(rec_id)
    {
        return db.execute('DELETE FROM emergency WHERE rec_id=(?)',[rec_id]);
    }
    static getRecordId(phone)
    {
        return db.execute('SELECT rec_id FROM emergency WHERE phone=(?)',[phone]);
    }
}