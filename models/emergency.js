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
    
}