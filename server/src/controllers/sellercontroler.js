import jwt from "jsonwebtoken"

// login seller : /api/seller/login

export const sellerLogin = async (req, res) =>{
    try {
        const {email, password} = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('sellerToken', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000,
        });

        return res.json({success: true, message: "logged in"});

    }else{
        return res.json({success: false, message: "Not Authorized"})
    }
    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

//check seller auth: /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        const token = req.cookies?.sellerToken;

        if (!token) {
            return res.json({ success: false, message: "No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email === process.env.SELLER_EMAIL) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: "Invalid token" });
        }

    } catch (error) {
        console.error("Auth check error:", error.message);
        return res.json({ success: false, message: "Unauthorized" });
    }
};

  //logout seller: /api/seller/logout
export const sellerLogout = async(req, res)=>{
    try {
        res.clearCookie('sellerToken',{
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({success: true, message:"Logged Out"})
    } catch (error) {
        console.log(error.message);    
        res.json({success:false, message: error.message})
    }
}