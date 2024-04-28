CREATE DATABASE upi;
USE upi;
CREATE TABLE Login(
User_id int NOT NULL AUTO_INCREMENT,
Name varchar(50) NOT NULL,
Password varchar(50) NOT NULL,
PhoneNumber varchar(10)
constraint CK_Login_PhoneNumber check(PhoneNumber like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
Email varchar(50),
PRIMARY KEY(User_id)
);
ALTER TABLE Login
DROP CONSTRAINT CK_Login_PhoneNumber;
CREATE TABLE bankinfo(
User_id int NOT NULL,
BanKName varchar(50) NOT NULL,
Account_No char(11) NOT NULL PRIMARY KEY ,
Account_Type varchar(20),
AccountBalance bigint, 
FOREIGN KEY (User_id) REFERENCES Login(User_id)
);
show tables;
desc Login;
select * from Login;
desc bankinfo;
select * from bankinfo;
