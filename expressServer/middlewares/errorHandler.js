const ErrorHandler = (err, req, res, next) => {
    console.error("Middleware Error Handling:", err);
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong on the server.';

    if (errStatus === 404) {
        res.status(errStatus).redirect(`/error-page?error=${encodeURIComponent(errMsg)}`)
    } else if (errStatus >= 500) {
        if (errMsg.includes("Cannot read properties of null")) {
            res.status(errStatus).redirect(`/error-page?error=${encodeURIComponent('Transcript not found')}`);
        }
    }
    res.status(errStatus).redirect(`/error-page?error=${encodeURIComponent(errMsg)}`);
};


module.exports = ErrorHandler;