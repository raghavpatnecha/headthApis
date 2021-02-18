const db=require('../util/database');

module.exports=class otptable{
    constructor(number,otp)
    {
        this.number=number;
        this.otp=otp;
    }
    save()
    {
        return db.execute('INSERT INTO otptable (number,otp) VALUES (?,?)',[this.number,this.otp]);
    }
    static checker(number)
    {
        return db.execute('SELECT * FROM otptable WHERE number=(?)',[number]);
    }
    static updater(number,otp)
    {
        return db.execute('UPDATE otptable SET otp=(?) WHERE number=(?)',[otp,number]);
    }
    static deleter(number)
    {
        return db.execute('DELETE FROM otptable WHERE number=(?)',[number]);
    }
}