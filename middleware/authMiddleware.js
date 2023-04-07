const jwt = require('jsonwebtoken');

function requireAuth(jsonToken){
    const token = jsonToken;
    if (token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'This secret should be long', (err,decodedToken) => {
                if (err) {
                    reject('failed');
                }
                else{
                    resolve(decodedToken.id)
                }
            });
        })
    }
    else{
        return 'failed'
    }
}

module.exports = requireAuth;