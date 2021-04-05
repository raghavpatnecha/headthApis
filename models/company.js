const db=require('../util/database');

module.exports=class Company{
    constructor(first,last,email,password,account,token,doc)
    {
        this.first=first;
        this.last=last;
        this.email=email;
        this.password=password;
        this.account=account;
        this.token=token;
        this.doc=doc;
    }
    save()
    {
        return db.execute('INSERT INTO company (email,password,first,last,account,token,image) VALUES (?,?,?,?,?,?,?)',[this.email,this.password,this.first,this.last,this.account,this.token,this.doc]);
    }
    static login(email)
    {
        return db.execute('SELECT * FROM company WHERE email=(?)',[email]);
    }
    static updateToken(token,email)
    {
        return db.execute('UPDATE company SET token=(?) WHERE email=(?)',[token,email]);
    }
    static check(email)
    {
        return db.execute('SELECT COUNT(email) AS num FROM company WHERE email=(?)',[email]);
    }
    static alterPass(email,password)
    {
        return db.execute('UPDATE company SET password=(?) WHERE email=(?)',[password,email]);
    }
}