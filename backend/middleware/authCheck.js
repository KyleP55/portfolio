const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //console.log('checking auth')
    try {
        let token = null;

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            //console.log('no header');
            return res.json({ errorMessage: "No Headers Attached" });
        }

        if (!token) {
            //console.log('invalid token');
            return res.json({ errorMessage: "Invalid Token" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { userId: decodedToken.userId }

        //console.log('auth completed');

        next();
    } catch (err) {
        return next(err);
    }
}