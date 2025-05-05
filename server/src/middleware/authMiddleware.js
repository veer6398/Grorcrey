import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.userId = decoded.id; 
      next();
     } // else {
    //   return res.status(401).json({ success: false, message: 'Not Authorized' });
    // }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
