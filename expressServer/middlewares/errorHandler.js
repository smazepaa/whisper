const ErrorHandler = (err, req, res, next) => {
    console.error("Middleware Error Handling:", err);
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong on the server.';

    if (errStatus === 404) { // because express automatically handles 404
        res.status(errStatus).render('errorPage', { message: errMsg });
    } else {
        res.status(errStatus).json({
            success: false,
            status: errStatus,
            message: errMsg,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        });

        res.redirect(`/error-page?error=${encodeURIComponent(errMsg)}`);
    }
};


module.exports = ErrorHandler;