import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
     const {token} = req.cookies; // Extract token from cookies
    
    if (!token) {
        return res.status(401).json({success: false, message: "Unauthorized access" });
    }

    try {
        const tokendecoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using JWT secret
        
       if(tokendecoded.userId){
        req.user = {
                userId: tokendecoded.userId,
                email: tokendecoded.email,
                isAccountVerified: tokendecoded.isAccountVerified
            }; // Attach user ID to request body // Attach user email to request body
       }
       else{
        return res.status(401).json({success: false, message: "Unauthorized access login again" });
       }
         // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: error.message });
    }
}

export default userAuth;
// This middleware function checks for a JWT token in the request cookies, verifies it, and attaches user information to the request object if valid. If the token is missing or invalid, it responds with an error message. This is used to protect routes that require user authentication.