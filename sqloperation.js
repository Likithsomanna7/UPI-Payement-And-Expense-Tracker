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

}