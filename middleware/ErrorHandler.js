// ErrorHandler.js
const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        statusCode: errStatus,
        message: errMsg,
    })
}

export default ErrorHandler