import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {add} from './sqloperation.js';
import bodyParser from 'body-parser';
import path from 'path';
const app=express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);
app.use(express.static(path.join(__dirname,'/')));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'/newuse.html'));
});
app.post('/bankinfo.html',async(req,res)=>{
    await add(req,res);
    res.redirect('/bankinfo.html');
});


app.listen(3000,()=>{
    console.log("listening to port 3000");
})
