const userDB = {
     users : require('../model/users.json'),
     setUsers : function(data){
        this.users = data 
     }
}

const fsPromises = require('fs').promises;  
const path = require('path');
const bcrypt = require('bcrypt')


const handleNewUser = async(req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({'message' : 'username and password are required'})
    //check for duplicate in db
    const duplicate = userDB.users.find(person => person.username === user)
    if(duplicate ) return res.sendStatus(409)
    try{
        //encrypt the passwod
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store user
        const newUser = {
            "username" : user , 
            "password" : hashedPwd,
            "roles":{"user":2001}
        }
        userDB.setUsers([...userDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname,'..', 'model', 'users.json' ), 
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users)
        res.status(201).json({"message" : `new user ${user} created`})
    }catch(err){
        res.status(500).json({'message' : err.message})
    }
}

module.exports = handleNewUser;