const db=require('../util/database');
module.exports=class User{
    constructor(mobile,name,dob,height,weight,blood) {
        this.mobile=mobile;
        this.name=name;
        this.dob=dob;
        this.height=height;
        this.weight=weight;
        this.blood=blood;
    }
    save()
    {
        return db.execute('INSERT INTO userbasic (mobile,name,height,weight,dob,blood) VALUES (?,?,?,?,?,?)',[this.mobile,this.name,this.height,this.weight,this.dob,this.blood]);
    }
    static getProfile(mobile)
    {
        return db.execute('SELECT * FROM userbasic WHERE mobile=(?)',[mobile]);
    }
}