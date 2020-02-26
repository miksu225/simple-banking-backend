const mongoose = require("mongoose");
const {User} = require("../models/user_model");

module.exports.connectMongoose = async function() {
    await mongoose.connect(
    "mongodb://miksu:miksu@localhost/banking",
    { useNewUrlParser: true,
    useUnifiedTopology: true }
    );
}

/* module.exports.closeMongoose = function() {
    mongoose.disconnect();
} */

async function usersCount() {
    const userCount = await User.countDocuments({}, function(err, count){
        if (err){
            return console.error(err);
        }else{
            return count;
        } 
    });
    return userCount;
}

async function updateBalance(id, amount, operation) {
    const user = await User.findOne({id: id});

    if (operation === "-"){
        if(user.balance >= amount){
            const newBalance = user.balance - amount;
            const updatedUser = await User.findOneAndUpdate(
                {id: id},
                {balance: newBalance},
                {new: true, useFindAndModify: false});
            return updatedUser.balance;
        }else{
            console.log("Not enough balance");
        }
    }else{
        const newBalance = user.balance + amount;
        const updatedUser = await User.findOneAndUpdate(
            {id: id},
            {balance: newBalance},
            {new: true, useFindAndModify: false});
        return updatedUser.balance;
    }
}

module.exports.newUser = async function(name, initDeposit, password) {
    const newId = await usersCount().then((newId) => {
        newId += 1;
        const newUser = new User({
            id: newId,
            name: name,
            balance: initDeposit,
            password: password
        });
    
        newUser.save();
        return newId;
    });
    return newId;
    
}

module.exports.getBalance = async function(id){
    const user = await User.findOne({id: id}, function (err, user) {
        if (err){
            return console.error(err)
        }else{
            return user;
        }
    });
    return user.balance;
}

module.exports.withdraw = async function(id, password, amount){
    const user = await User.findOne({id: id, password: password}, function (err, user) {
        if (err){
            return console.error(err)
        }else{
            return user;
        }
    });
    if (user){
       return updateBalance(id, amount, "-");
    }else{
        console.log("no user found");
    }
}

module.exports.deposit = async function(id, password, amount){
    const user = await User.findOne({id: id, password: password}, function (err, user) {
        if (err){
            return console.error(err)
        }else{
            return user;
        }
    });
    if (user){
        return updateBalance(id, amount, "+");
    }else{
        console.log("no user found");
    }
}

module.exports.transfer = async function(id, password, receiverId, amount){
    const userSender = await User.findOne({id: id, password: password}, function (err, user) {
        if (err){
            return console.error(err)
        }else{
            return user;
        }
    });

    const userReceiver = await User.findOne({id: receiverId}, function (err, user) {
        if (err){
            return console.error(err)
        }else{
            return user;
        }
    });
    if (userSender && userReceiver){
        if (userSender.balance >= amount){
            updateBalance(receiverId, amount, "+");
            return updateBalance(id, amount, "-");
        }else{
            console.log("Not enough balance");
        }
    }else{
        console.log("no user found");
    }
}

module.exports.updateName = async function(id, newName){
    const user = await User.findOne({id: id}, function (err, user) {
        if (err){
            return console.error(err)
        }else{
            return user;
        }
    });
    if (user){
            const updatedUser = await User.findOneAndUpdate(
                {id: id},
                {name: newName},
                {new: true, useFindAndModify: false});
            return updatedUser.name;
    }else{
        console.log("no user found");
    }
}

module.exports.updatePassword = async function(id, newPassword){
    const user = await User.findOne({id: id}, function (err, user) {
        if (err){
            return console.error(err)
        }else{
            return user;
        }
    });
    if (user){
            const updatedUser = await User.findOneAndUpdate(
                {id: id},
                {password: newPassword},
                {new: true, useFindAndModify: false});
            return updatedUser.password;
    }else{
        console.log("no user found");
    }
}