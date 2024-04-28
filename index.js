import express from 'express';
import { connect } from './connect.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {checkname,add,bankinfoadd,userauth} from './sqloperation.js';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
const MySQLStore = MySQLStoreFactory(session);
const app=express();
app.set('view engine','ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const sessionstore=new MySQLStore({createDatabaseTable:true},connect);
const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);

app.use(express.static(path.join(__dirname,'/')));

app.set('views',path.join(__dirname,'views'));

app.use(session({
    secret:'hello',
    resave:false,
    saveUninitialized:false,
    store:sessionstore,
    cookie:{
        httpOnly:true,
        sameSite:true
    }

}))
 app.get('/newuse',function(req,res){
    res.render('newuse',{alertmessage:""});
  });

 
 app.post('/newuse',async(req,res)=>{
    await checkname(req,res)
    .then(([rows])=>{
    console.log(rows); 
    if(rows.length){
        console.log("user exists");
        return res.render('newuse',{alertmessage:'username exists'});
    }
    add(req,res);
    return res.redirect('/bankinfo.html');
}).catch((err)=>{
    console.log(err);
})
});


app.post('/main.html',async(req,res)=>{
    await bankinfoadd(req,res);
    res.redirect('/main.html');
})

app.get('/login',function(req,res){
    res.render('login',{message:""});
  });

app.post('/login',async(req,res)=>{
    await userauth(req,res)
    .then(([results])=>{
        console.log(results.length)
        if(results.length>0){
            req.session.auth=true;
           return res.redirect('/main.html');
        }
        else{
           return res.render('login',{message:'invalid username or password'});
        }
    }).catch((err)=>{
        console.log(err);
    })
});

app.listen(3000,()=>{
    console.log("listening to port 3000");
})
