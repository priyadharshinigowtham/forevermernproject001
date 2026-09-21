import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        
        // Assuming the admin JWT payload is an object with an 'email' field
        // If your admin token signing method is different, adjust accordingly.
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth