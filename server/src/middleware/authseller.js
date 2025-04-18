import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (decoded.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.status(401).json({ success: false, message: 'Not Authorized' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authSeller;