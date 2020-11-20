const db=require('../util/database');

module.exports=class Company{
    constructor(first,last,email,password)
    {
        this.first=first;
        this.last=last;
        this.email=email;
        this.password=password;
    }
    save()
    {
        return db.execute('INSERT INTO company (email,password,first,last) VALUES (?,?,?,?)',[this.email,this.password,this.first,this.last]);
    }
    static login(email)
    {
        return db.execute('SELECT * FROM company WHERE email=(?)',[email]);
    }
    static check(email)
    {
        return db.execute('SELECT COUNT(email) AS num FROM company WHERE email=(?)',[email]);
    }
}