const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            console.log('no header: ' + req.headers.authorization);
            throw new Error('No Header/Token')
        }

        if (!token) {
            //console.log('invalid token');
            throw new Error('Invalid Token')
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { id: decodedToken.id, userName: decodedToken.userName }

        next();
    } catch (err) {
        return res.json({ message: err.message });
    }
}