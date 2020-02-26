const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {connectMongoose, newUser, getBalance,
    withdraw, deposit, transfer, updateName, updatePassword} = require("./controllers/db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let users = [];

app.use((req,res,next) => {
    console.log("Middleware here!");
    connectMongoose();
    next();
});


//create new user
app.post("/bank/user", (req, res) => {
    console.log("POSTing new user!");
    const user = req.body;
    if (user.name && user.initDeposit && user.password && user.repeatPassword) {
        if (user.password === user.repeatPassword){
            newUser(user.name, user.initDeposit, user.password).then((newId) => {
                console.log("sending new id: ", newId);
                res.send({id: newId});
            
            });

        }else{
            res.send("Passwords dont match");
        }
    }else{
        res.send("Missing values");
    }
});

//get user balance
app.get("/bank/:userId/balance", (req, res) => {
    console.log("GETting balance!");
    getBalance(parseInt(req.params.userId)).then((balance) => {
        res.send({balance: balance});
    });
});

//withdraw money
app.patch("/bank/user/withdraw", (req, res) => {
    console.log("PATCHing  balance(withdraw)!!");

    withdraw(req.body.id, req.body.password, req.body.amount).then((newBalance) => {
        res.send({balance: newBalance});
    });
});

//deposit money
app.patch("/bank/user/deposit", (req, res) => {
    console.log("PATCHing  balance(deposit)!!");
    
    deposit(req.body.id, req.body.password, req.body.amount).then((newBalance) => {
        res.send({balance: newBalance});
    });
});

//transfer money
app.patch("/bank/user/transfer", (req, res) => {
    console.log("PATCHing  balance(transfer)!!");
    
    transfer(req.body.id, req.body.password, req.body.recipient_id, req.body.amount).then((newBalance) => {
        res.send({balance: newBalance});
    });
});

//update name
app.patch("/bank/user/name", (req, res) => {
    console.log("PATCHing  name!!");
    updateName(req.body.id, req.body.name).then((newName) => {
        res.send({name: newName});
    });
});

//update password
app.patch("/bank/user/password", (req, res) => {
    console.log("PATCHing  password!!");
    updatePassword(req.body.id, req.body.password).then((newPassword) => {
        res.send({password: newPassword});
    });
});

app.get("/bank/all", (req, res) => {
    console.log("GETting all!!");
    console.log(users);
    res.send("OK");
});

console.log("Listening to port 5000");
app.listen(5000); 