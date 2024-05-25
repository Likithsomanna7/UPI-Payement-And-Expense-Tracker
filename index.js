import express from 'express';
import { connect } from './connect.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {checkname,add,bankinfoadd,userauth,transaction,transactiondata} from './sqloperation.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
const MySQLStore = MySQLStoreFactory(session);
const app=express();
app.set('view engine','ejs');
app.use(express.json());
app.use(cookieParser('djhjsdkf'));
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
const isauth=(req,res,next)=>{
    if(req.session.auth){
        next();
    }else{
        res.redirect('/login');
    }
}

const check=async(req,res,next)=>{
    await checkname(req,res)
    .then(([rows])=>{
    console.log(rows); 
    if(rows.length){
        console.log("user exists");
        return res.render('newuse',{alertmessage:'username exists'});
    }else{
        next();
    }
    }).catch((err)=>{
        console.log(err);
    })
}
 app.get('/newuse',function(req,res){
    res.render('newuse',{alertmessage:""});
  });

 
 app.post('/newuse',check,async(req,res)=>{

    const [row]=await add(req,res);
    req.session.auth=true;
    res.cookie('user_id',row[0].user_id,{signed:true,sameSite:true,httpOnly:true});
    res.cookie('username',req.body.username,{signed:true,sameSite:true,httpOnly:true});
    return res.redirect('/bankinfo.html');
});


app.post('/bankinfo.html',async(req,res)=>{
    await bankinfoadd(req,res);
    res.redirect('main');
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
            console.log(results[0].User_id);
            res.cookie('user_id',results[0].User_id,{signed:true,sameSite:true,httpOnly:true});
            res.cookie('username',req.body.username,{signed:true,sameSite:true,httpOnly:true});
           return res.redirect('main');
        }
        else{
           return res.render('login',{message:'invalid username or password'});
        }
    }).catch((err)=>{
        console.log(err);
    })
});
app.get('/main',isauth,async(req,res)=>{
    res.render('main',{message:""});
})
app.post('/logout',async(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        else{
            res.redirect('/');
        }
    })
})

app.post('/main',async(req,res)=>{
    await transaction(req,res)
    .then((results)=>{
        console.log(results);
        if(results){
            return res.render('main',{message:'Transaction succesfull'});
        }else{
            return res.render('main',{message:'insufficiant balance'});
        }
    }).catch((err)=>{
        if(err) throw err;
    })

})


app.get('/trasaction',async(req,res)=>{
    const [data]=await transactiondata(req,res);
    console.log(data);
    console.log("kk");
    res.status(200).json({data});
})

app.listen(3000,()=>{
    console.log("listening to port 3000");
})
