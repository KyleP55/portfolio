const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('checking auth')
    try {
        let token = null;

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            console.log('no header');
            return
        }
        if (!token) {
            console.log('invalid token');
            return
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { userId: decodedToken.userId }
        console.log('auth completed')
        res.send(200).json({ auth: true });
        next();
    } catch (err) {
        return next(err);
    }
}