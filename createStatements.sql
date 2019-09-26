-- first clear old version if there is one

drop database if exists customerdb;

-- create database
create database customerdb;

-- connect to that db. Now further commands modifies customerdb
use customerdb;

-- create table(s)
create table customer (
    customerId integer not null primary key, -- unique value, compulsory column
    firstname varchar(8) not null, -- required
    lastname varchar(16) not null, -- required
    address varchar(21) not null, 
    favouriteicecream varchar(28) not null
);

insert into customer (customerId, firstname, lastname, address, favouriteicecream)
values (1,'Mikko', 'Saarela', 'Helsinki', 'Twisteri');

insert into customer values (2,'Matti','Koikkalainen', 'Pori', 'Lakritsijaatelo');
insert into customer values (3,'Jari','Pori', 'Vantaa', 'Kinuskijaatelo');
insert into customer values (4,'Pentti','Vesala', 'Jyvaskyla', 'Mansikka');

CREATE USER IF NOT EXISTS 'ella'@'localhost' identified by 'UNcUd49J';

-- we give access to the user to out database
grant all privileges on customerdb.* to 'ella'@'localhost';