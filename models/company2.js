const db=require('../util/database');

module.exports=class Company2{
    constructor(email,summary,img)
    {
        this.email=email;
        this.summary=summary;
        this.img=img;
    }
    save()
    {
        return db.execute('INSERT INTO company2 (email,summary,img) VALUES (?,?,?)',[this.email,this.summary,this.img]);
    }
    static getInfo(email)
    {
        return db.execute('SELECT * FROM company2 WHERE email=(?)',[email]);
    }
    static updateSummary(summary,email)
    {
        return db.execute('UPDATE TABLE company2 SET summary=(?) WHERE email=(?)',[summary,email]);
    }
    static updateImg(img,email)
    {
        return db.execute('UPDATE TABLE company2 SET img=(?) WHERE email=(?)',[img,email]);
    }
    static updateBoth(summary,email,img)
    {
        return db.execute('UPDATE TABLE company2 SET summary=(?), img=(?) WHERE email=(?)',[summary,img,email]);
    }
    static check(email)
    {
        return db.execute('SELECT COUNT(email) AS c FROM company2 WHERE email=(?)',[email]);
    }
}