import allowedOrigins from '../config/allowedOrigins.js'

const credentials = (req, res, next) => {
    const origin = req.headers.origins

    if(allowedOrigins.includes(origin)){
        res.header('Access-Control-Allow-Origin', true)
    }

    next()
}

export default credentials;