import {connect} from './connect.js'
export const checkname=async(req,res)=>{
    let username=req.body.username;
    console.log(username);
    const [rows,feild]=await connect.query(`SELECT Name from Login WHERE Name=?`,[username])
    console.log(rows);

return [rows];
}
export const add=async(req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    const phonenumber=req.body.phonenumber;
    let email=req.body.email;
    await connect.query(`INSERT INTO Login (Name,Password,PhoneNumber,Email)
    values(?,?,?,?)`,[username,password,phonenumber,email]);
    const [rows,feilds]=await connect.query(`SELECT User_id from Login WHERE Name=?`,[username])
    console.log(rows);
    return [rows];

};

export const bankinfoadd=async(req,res)=>{
    let bankname=req.body.bankname;
    let account_type=req.body.account_type;
    let account_number=req.body.account_number;
    let account_balance=req.body.account_balance;
    await connect.query(`SELECT User_id from Login`)
    .then(([rows,feilds])=>{
 
        console.log(rows[rows.length-1].User_id);
        var User_id=rows[rows.length-1].User_id;
        return User_id;
    
}).then((User_id)=>{
    res.cookie('user_id',User_id,{signed:true});
    connect.query(`INSERT INTO bankinfo(User_id,BanKName,Account_No,Account_Type,AccountBalance)
    values(?,?,?,?,?)`,[User_id,bankname,account_number,account_type,account_balance]);
})
.catch((err)=>{
    console.log(err);
});
    
};
 export const userauth=async(req,res)=>{
    let username=req.body.username;
  let password=req.body.password;
  const[rows,feilds]=await connect.query(`SELECT * FROM Login WHERE Name=? and Password=?`,[username,password]);
  console.log(rows);
  return [rows];

};

export const transaction=async(req,res)=>{
    const items=req.body.items;
    const upi_id=req.body.upi_id;
    const amount=req.body.amount;
   
    await connect.query(`START TRANSACTION`);
    await connect.query(`BEGIN;`);
    await connect.query(`SELECT * FROM bankinfo WHERE User_id=? FOR UPDATE`,[req.signedCookies.user_id]);
    const [balance,feilds]=await connect.query(`SELECT AccountBalance from bankinfo WHERE User_id=?`,[req.signedCookies.user_id]);
    console.log(balance[0].AccountBalance);
    if((balance[0].AccountBalance)-amount>=0){
    await connect.query(`UPDATE bankinfo SET AccountBalance=? where User_id=?`,[balance[0].AccountBalance-amount,req.signedCookies.user_id]);
    await connect.query('INSERT INTO transaction values(?,?,?,?,?,NOW())',[req.signedCookies.user_id,req.signedCookies.username,items,amount,upi_id]);
    await connect.query(`COMMIT`);
    return 1;
    }else{
        await connect.query(`ROLLBACK`);
        return 0;
    }

    
}

export const transactiondata=async(req,res)=>{
    const [data,feilds]=await connect.query(`select * from transaction where User_id=? and Name =?`,[req.signedCookies.user_id,req.signedCookies.username])
    return [data];
}

export const monthlydata=async(req,res)=>{
    const [data,feilds]=await connect.query(`select * from MONTHLY_TOTAL WHERE User_name=? and User_id=?`,[req.signedCookies.username,req.signedCookies.user_id])
    return [data];
}

export const yearlydata=async(req,res)=>{
    const [data,feilds]=await connect.query(`select * from YEARLY_TABLE WHERE User_name=? and User_id=? `,[req.signedCookies.username,req.signedCookies.user_id])
    return [data];
}