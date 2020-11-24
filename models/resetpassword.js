const db=require('../util/database');

module.exports=class resetPassword{
    constructor(email,token,time)
    {
        this.email=email;
        this.token=token;
        this.time=time;
    }
    save()
    {
        return db.execute('INSERT INTO resetpassword (email,token,time) VALUES (?,?,?)',[this.email,this.token,this.time]);
    }
    static search(token)
    {
        return db.execute('SELECT * FROM resetpassword WHERE token=(?)',[token]);
    }
    static delete(email,token)
    {
        return db.execute('DELETE FROM resetpassword WHERE email=(?) AND token=(?)',[email,token]);
    }
}