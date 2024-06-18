const allowedOrigins = require('./allowedOrigins')

const credentials = (req, res, next) => {
    const origin = req.headers.origins

    if(allowedOrigins.includes(origin)){
        res.header('Access-Controlle-Allow-Origin', true)
    }

    next()
}

module.exports = credentials;