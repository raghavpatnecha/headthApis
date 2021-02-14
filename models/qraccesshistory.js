const db=require('../util/database');

module.exports= class qrAccessHistory{
    constructor(user,accesser,date,time,latitude,longitude)
    {
        this.user=user;
        this.accesser=accesser;
        this.date=date;
        this.time=time;
        this.latitude=latitude;
        this.longitude=longitude;
    }
    save()
    {
        return db.execute('INSERT INTO qraccesshistory (user,accesser,date,time,latitude,longitude) VALUES (?,?,?,?,?,?)',[this.user,this.accesser,this.date,this.time,this.latitude,this.longitude]);
    }
}