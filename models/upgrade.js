const db=require('../util/database');

module.exports=class upgrade{
    constructor(mobile,request)
    {
        this.mobile=mobile;
        this.request=request;
    }
    save()
    {
        db.execute('INSERT INTO upgrade (mobile,request) VALUES (?,?)',[this.mobile,this.request]);
    }
    static check(mobile)
    {
        db.execute('SELECT mobile FROM upgrade WHERE mobile=(?)',[mobile]);
    }
}