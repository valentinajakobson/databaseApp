'use strict';

const http = require('http');
const express = require('express');
const path = require('path');

const app=express();

const port = process.env.PORT || 3003;
const host = process.env.HOST || 'localhost';

const server = http.createServer(app);

const CustomerDataStorage=require('./datastorage.js');
const dataStorage = new CustomerDataStorage();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

app.get('/', (req, res) => 
res.sendFile(path.join(__dirname, 'public', 'menu.html')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));

app.get('/all', (req,res)=> dataStorage.getAll()
    .then(result => res.render('allCustomers', {result}))
    .catch(err => console.log(err.message))
);

app.get('/getcustomer', (req, res) =>
res.render('getCustomer', {title: 'Get', header: 'Get', action:'/getcustomer'})
);

app.post('/getcustomer', (req,res)=>{
    if(!req.body) res.sendErrorPage('Not found');
    const customerId=req.body.customerId;
    dataStorage.get(customerId)
    .then(customer => res.render('customerPage', {result: customer}))
    .catch(error=>sendErrorPage(res,error.message));
});

app.get('/inputform', (req, res)=>{
    res.render('form', {
        header:'Add a new customer',
        action:'/insert',
        customerId:{value:'', readonly:''},
        firstname:{value:'', readonly:''},
        lastname:{value:'', readonly:''},
        address:{value:'', readonly:''},
        favouriteicecream:{value:'', readonly:''}
    });
});

app.post('/insert', (req,res)=>{
    if(!req.body) sendErrorPage(res, 'Not found');
    dataStorage.insert(req.body)
        .then(message => sendStatusPage(res, message))
        .catch(error => sendErrorPage(res,error));
});

app.get('/updateform', (req,res) => {
    res.render('form', {
        header:'Update customer',
        action:'/updatedata',
        customerId:{value:'', readonly:''},
        firstname:{value:'', readonly:'readonly'},
        lastname:{value:'', readonly:'readonly'},
        address:{value:'', readonly:'readonly'},
        favouriteicecream:{value:'', readonly:'readonly'}
    });
})

app.post('/updatedata', async (req,res) => {
    const customerId=req.body.customerId;
    try {
        const customer=await dataStorage.get(customerId);
        console.log(customer);
        res.render('form', {
            header: 'Update customer data',
            action: '/updatecustomer',
            customerId:{value:customer.customerId, readonly:'readonly'},
            firstname:{value:customer.firstname, readonly:''},
            lastname:{value:customer.lastname, readonly:''},
            address:{value:customer.address, readonly:''},
            favouriteicecream:{value:customer.favouriteicecream, readonly:''}
        });
    }
    catch(err){
        sendErrorPage(res,err.message);
    }
})

app.post('/updatecustomer', (req,res) => {
    if(!req.body) sendErrorPage(res, 'Not found');
    dataStorage.update(req.body)
        .then(message=>sendStatusPage(res,message))
        .catch(error=>sendErrorPage(res,error.message))
});


app.get('/deletecustomer', (req,res) => 
    res.render('getCustomer', {title:'Remove', header:'Remove', action:'/deletecustomer'})
);

app.post('/deletecustomer', (req,res) => {
    if(!req.body) sendErrorPage(res, 'Not found');
    dataStorage.delete(req.body.customerId)
        .then(message=>sendStatusPage(res, message))
        .catch(error=>sendErrorPage(res, error.message));
});


server.listen(port, host, ()=>
console.log(`Server ${host} is server at port ${port}.`));

function sendErrorPage(res, message){
    res.render('statusPage', {title:'Error', 
                              header:'Error', 
                              message:message});
}

function sendStatusPage(res, message){
    res.render('statusPage', {title:'Status', 
                              header:'Status', 
                              message:message});
}