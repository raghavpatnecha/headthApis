const express=require('express');
const bodyParser=require('body-parser');
const db=require('./util/database');
const auth=require('./routes/auth');
const path=require('path');
const multer=require('multer');
const { uuidv4 } = require('uuid');
const app=express();

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log("here is the error");
        cb(null,'images');
    },
    filename: function(req,file,cb){
        console.log("here is the issue");
        cb(null,file.originalname);
    }
});

const fileFilter2=(req,file,cb)=>{
    if(file.mimetype==='image/png'||
       file.mimetype==='image/jpg'||
       file.mimetype==='image/jpeg')
       {
           console.log("getting our fromhere");
           cb(null,true);
       }
       else
       {
           console.log("getting out fromhere 2");
           cb(null,false);
       }
}

app.use(bodyParser.json());
//registering multer to store images
app.use(multer({storage:fileStorage,fileFilter:fileFilter2}).single('image'));

//app.use('/images',express.static(path.join(__dirname,'images')))
//this line below is to check if connection with mysql server is working or not
db.execute('select * from userbasic').then(result=>{
    console.log('connected and is success');
}).catch(err=>{
    console.log('error');
});



//defining a function to set headers so that it could be accessible from other ip addressses as well
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
});

app.use('/app1',auth);

app.use((error,req,res,next)=>{
    console.log(error);
    const status=error.statusCode;
    const message=error.message;
    res.status(201).json({status:0, msg:message});
})
//CT20182428795
app.listen(5000);