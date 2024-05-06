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
CREATE TABLE transaction(
User_id int(10) NOT NULL,
Name varchar(50),
Items varchar(30),
Amount bigint,
Upi_id varchar(50),
Transaction_time varchar(100),
FOREIGN KEY(User_id) REFERENCES bankinfo(User_id)
);
CREATE TABLE MONTHLY_TOTAL(
User_id int(10) NOT NULL,
User_name varchar(100),
Food_and_groceries bigint,
Child_expense bigint,
Housing_expense bigint,
Misellenious bigint,
Total_amount bigint,
Month_name varchar(50),
Year int(50)
);
CREATE TABLE YEARLY_TABLE(
User_id int(10) NOT NULL,
User_name varchar(100),
Food_and_groceries bigint,
Child_expense bigint,
Housing_expense bigint,
Misellenious bigint,
Total_amount bigint,
Year int(50)
);
desc YEARLY_TABLE;
delimiter //
CREATE EVENT MONTHLY_TOTAL
ON schedule EVERY 1 MONTH
STARTS '2024-06-01 12:00:00'
DO
BEGIN
INSERT INTO MONTHLY_TOTAL
SELECT User_id,Name,sum(CASE WHEN Items='food and groceries' THEN Amount ELSE 0 END),
sum(CASE WHEN Items='child expense' THEN Amount ELSE 0 END),
sum(CASE WHEN Items='housing expense' THEN Amount ELSE 0 END),
sum(CASE WHEN Items='misellenious' THEN Amount ELSE 0 END),
sum(Amount),MONTHNAME(CURDATE()-INTERVAL 1 MONTH),YEAR(CURDATE()-INTERVAL 1 MONTH)
FROM transaction 
where MONTH(Transaction_time)=MONTH(CURDATE()-INTERVAL 1 MONTH)
GROUP BY User_id,Name;
END//
delimiter //
CREATE EVENT YEARLY_TOTAL
ON schedule EVERY 1 YEAR
STARTS '2025-01-01 12:00:00'
DO
BEGIN
INSERT INTO YEARLY_TABLE
SELECT User_id,Name,sum(Food_and_groceries),
sum(Child_expense),
sum(Housing_expense),
sum(Misellenious),
sum(Total_amount),YEAR(CURDATE()-INTERVAL 1 YEAR)
FROM MONTHLY_TOTAL
where Year=YEAR(CURDATE()-INTERVAL 1 YEAR)
GROUP BY User_id,Name;
END//

alter table MONTHLY_TOTAL add foreign key(User_id) references bankinfo(User_id);
show tables;
desc MONTHLY_TOTAL;
select * from transaction;
select * from MONTHLY_TOTAL;
alter table transaction drop column type;
select * from sessions;
desc Login;
select * from Login;
desc bankinfo;
select * from bankinfo;
set sql_safe_updates=0;
truncate sessions;
delete from Login;
delete from bankinfo;
set sql_safe_updates=1;
