'use strict';

const Database = require ('./database.js');
const fatalError = err => new Error (`Sorry! ${err.message}`);
const getAllCustomers = 'select customerId, firstname, lastname, address, favouriteicecream from customer';
const getCustomer = 'select customerId, firstname, lastname, address, favouriteicecream from customer ' + 'where customerId = ?';
const insertCustomer=
    'INSERT INTO customer (customerId, firstname, lastname, address, favouriteicecream) ' +
    'values(?,?,?,?,?)';

const updateCustomer=
    'UPDATE customer SET firstname=?, lastname=?, address=?, favouriteicecream=?  WHERE  customerId=? ';

const deleteCustomer=
    'DELETE FROM customer WHERE customerId=?';

const customervalues = customer => [
    +customer.customerId,customer.firstname,customer.lastname,
    customer.address,customer.favouriteicecream
];

const customerValuesForUpdate = customer => [
    customer.firstname,customer.lastname,
    customer.address,customer.favouriteicecream, +customer.customerId
];

module.exports = class CustomerDataStorage {
    constructor () {
        this.customerDb = new Database ({
            'host': 'localhost',
            'port': 3306,
            'user': 'ella',
            'password': 'UNcUd49J',
            'database': 'customerdb'
        })
    }

    getAll(){
        return new Promise(async (resolve, reject) =>{
            try {
                const result = await this.customerDb.doQuery(getAllCustomers);
                resolve(result.queryResult);
            }
            catch(err){
                reject(fatalError(err));
            }
        })
    }
    get(customerId){
        return new Promise(async (resolve, reject) => {
            try {
                const result=await this.customerDb.doQuery(getCustomer, [+customerId]);
                if (result.queryResult.length===0){
                    reject(new Error('Customer unknown'));
                } else {
                    resolve(result.queryResult[0]);
                }
            }
        catch(err){
            reject(new Error(`Sorry! Error. ${err.message}`))
        }
        });
    }

    insert(customer){
        return new Promise(async (resolve,reject) => {
            try{
                const result = await this.customerDb.doQuery(insertCustomer, customervalues(customer));
                if (result.queryResult.rowsAffected===0){
                    reject (new Error ('No customer was added'));
                }else{
                    resolve (`Customer with id ${customer.customerId} was added`);
                }
             }
            catch(err){
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }
    update (customer){
        return new Promise(async (resolve,reject) => {
            try{
                const result = await this.customerDb.doQuery(updateCustomer, customerValuesForUpdate(customer));
                if (result.queryResult.rowsAffected===0){
                    resolve('No data was updated');
             }
                else{
                    resolve (`Data of customer with id ${customer.customerId} was updated`)
                }
            }
            catch(err){
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }

    delete (customerId){
        return new Promise(async (resolve,reject) => {
            try{
                const result = await this.customerDb.doQuery(deleteCustomer,[+customerId]);
                if (result.queryResult.rowsAffected===0){
                    resolve('No data was deleted');
            }
                else{
                    resolve (`Customer with id ${customerId} was deleted`);
                }
            }
            catch(err){
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }
 };