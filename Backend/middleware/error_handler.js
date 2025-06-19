function errorHandler(err, res, next){
    console.error(err.stack);
    res.status(500).send(err.message)
}

export default errorHandler;