import {connect} from './connect.js'
export const add=async(req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    const phonenumber=req.body.phonenumber;
    let email=req.body.email;
    await connect.query(`INSERT INTO Login (Name,Password,PhoneNumber,Email)
    values(?,?,?,?)`,[username,password,phonenumber,email]);
     
};