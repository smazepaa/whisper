const ErrorHandler = (err, req, res, next) => {
    console.error("Middleware Error Handling:", err);
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong on the server.';

    if (errMsg.includes("Cannot read properties of null")) {
        res.status(errStatus).redirect(`/error-page?error=${encodeURIComponent('Transcript not found')}`);
    }
    else if(errMsg.includes("Cast to ObjectId failed for value")){
        res.status(errStatus).redirect(`/error-page?error=${encodeURIComponent('Transcript not found, invalid Id')}`);
    }
    res.status(errStatus).redirect(`/error-page?error=${encodeURIComponent(errMsg)}`);
};


module.exports = ErrorHandler;