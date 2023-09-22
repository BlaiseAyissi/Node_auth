const userDB = {
    users : require('../model/users.json'),
    setUsers : function(data){
       this.users = data 
    }
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookie = req.cookies
    if(!cookie?.jwt) return res.sendStatus(401);
    const refreshToken = cookie.jwt

    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken );
    if(!foundUser) return res.sendStatus(403); //forbidden

    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
           if(err || foundUser.username !== decoded.username ) return res.sendStatus(403);
           const roles = Object.values(foundUser.roles)
           const accessToken = jwt.sign(
            {"userInfo":{
                "username":foundUser.username,
                "roles":roles
            }},
            process.env.REFRESH_TOKEN_SECRET, 
            {expiresIn:'30s'}
           );
           res.json({accessToken})
        }
    )
       
}

module.exports = {handleRefreshToken};