const db=require('../util/database');

module.exports=class Dieseas{
    constructor(mobile,name,details)
    {
        this.mobile=mobile;
        this.name=name;
        this.details=details;
    }
    save(){
        return db.execute('INSERT INTO dieseas (mobile,name,details) VALUES (?,?,?)',[this.mobile,this.name,this.details]);
    }
    static getDieseasByMobile(mobile)
    {
        return db.execute('SELECT * FROM dieseas WHERE mobile=(?)',[mobile]);
    }
    static deleteDieseas(id)
    {
        return db.execute('DELETE FROM dieseas WHERE id=(?)',[id]);
    }
    static updateDiesease(id,name,details)
    {
        return db.execute('UPDATE dieseas SET name=(?),details=(?) WHERE id=(?)',[name,details,id]);
    }
}