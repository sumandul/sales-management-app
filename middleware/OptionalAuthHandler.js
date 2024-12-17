import jwt from 'jsonwebtoken';

const OptionalAuthHandler = (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    try {
        if (authorization && authorization.startsWith("Bearer")) {
            token = authorization.split(' ')[1];
            const jwtSecret = process.env.JWT_SECURE_KEY;
            const { userId , role } = jwt.verify(token, jwtSecret);
            req.userId = userId;
            req.role = role;
        }
        next();
    } catch (error) {
        res.status(401).json({
            "statusCode": 401,
            "message": "Unauthorized",
        });
    }

}

export default OptionalAuthHandler;