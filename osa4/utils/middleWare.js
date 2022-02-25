const errorHandler = (err, req, res, next) => {

    console.log("............. IN ERROR ...............");
    console.log(err)
    console.log(err.message)
    console.log("......................................");

    if(err.name === 'ValidationError') {
        return res.status(400).json({error: err.message});
    } else if(err.name === 'CastError') {
        return res.status(400).json({error: err.message});
    }

    next(err);

}

module.exports = {
    errorHandler
}