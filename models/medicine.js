const db=require('../util/database');

module.exports=class Medicine{
    constructor(mobile,name,purpose,duration,dosage)
    {
        this.mobile=mobile;
        this.name=name;
        this.purpose=purpose;
        this.duration=duration;
        this.dosage=dosage;
    }
    save()
    {
        return db.execute('INSERT INTO medicine (mobile,name,purpose,duration,dosage) VALUES (?,?,?,?,?)',[this.mobile,this.name,this.purpose,this.duration,this.dosage]);
    }
    static getMedicines(mobile)
    {
        return db.execute('SELECT * FROM medicine WHERE mobile=(?)',[mobile]);
    }
}