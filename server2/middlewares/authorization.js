import process from 'node:process';
import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith('Bearer')) {
    return res.status(401).json({status: 'fail', message: 'authorization Bearer Token is not valid'});
  }
  try {
    const token = authToken.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.empId = decoded._id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({success: false, message: 'Token is Expired'});
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({success: false, message: 'Invalid token'});
    }
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
};