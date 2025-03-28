import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  // Generates token with userId as payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Sets the token to the cookie response
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //only works on https
    sameSite: "none",
    // sameSite: "strict",  only allow same domain requests
    maxAge: 7 * 24 * 60 * 60 * 1000, //expires in 7days
  });
  return token;
};
