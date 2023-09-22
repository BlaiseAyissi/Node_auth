const userDB = {
    users : require('../model/users.json'),
    setUsers : function(data){
       this.users = data 
    }
}
const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
    //on client also delete the accessToken
    const cookie = req.cookies
    if(!cookie?.jwt) return res.sendStatus(204); //no content 
    const refreshToken = cookie.jwt

    //is the refresh token in the database
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken );
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true})
        return res.sendStatus(204); //forbidden
    } 

    //delete the refresh token from db
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    currentUser = {...foundUser, refreshToken : ''}
    userDB.setUsers([...otherUsers, currentUser]);  

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'), 
        JSON.stringify(userDB.users)
    )
    
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true}) //secure : true in release version
    res.sendStatus(204);
}

module.exports = {handleLogout};