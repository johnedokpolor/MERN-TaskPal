import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  // Extracts token and checks whether it's available
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorised - no token provided" });
  try {
    // Verifies token with signature and saves  payload in "decoded" after it's verified
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorised - Invalid token" });
    // Assigns token userId to req.userId
    req.userId = decoded.userId;

    // calls next function to proceed to next middleware or route
    next();
  } catch (error) {
    console.log("Error in verify token", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
