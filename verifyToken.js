const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next) {
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send('JWT token missing')
    }

    try {
        const verified = jsonwebtoken.verify(token, process.env.JWT)
        req.user = verified
        next()
    } catch(err) {
        return res.status(401).send('Request denied')
    }
}

module.exports = auth