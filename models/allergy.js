const db=require('../util/database');

module.exports=class Allergy{
    constructor(mobile,allergy,triggers)
    {
        this.mobile=mobile;
        this.allergy=allergy;
        this.triggers=triggers;
    }
    save()
    {
        return db.execute('INSERT INTO allergies (mobile,allergy,triggers) VALUES (?,?,?)',[this.mobile,this.allergy,this.triggers]);
    }
    static add(mobile,allergy,triggers)
    {
        return db.execute('INSERT INTO allergies (mobile,allergy,triggers) VALUES (?,?,?)',[mobile,allergy,triggers]);
    }
    static getAllergyByMobile(mobile)
    {
        return db.execute('SELECT * FROM allergies WHERE mobile=(?)',[mobile]);
    }
}