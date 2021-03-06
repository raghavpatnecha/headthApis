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
    static updateMedicine(id,name,purpose,dosage,duration)
    {
        return db.execute('UPDATE medicine SET name=(?),purpose=(?),duration=(?),dosage=(?) WHERE id=(?)',[name,purpose,duration,dosage,id]);
    }
    static deleteMedicine(id)
    {
        return db.execute('DELETE FROM medicine WHERE id=(?)',[id]);
    }
}