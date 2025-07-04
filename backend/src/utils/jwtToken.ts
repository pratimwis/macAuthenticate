import { Response } from "express";
import jwt from "jsonwebtoken";
export const genarateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: "https://macauthenticate.onrender.com", // set this if frontend and backend are on the same root domain
  });
  return token;
};
