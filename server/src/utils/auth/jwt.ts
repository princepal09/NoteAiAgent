import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../lib/constants";

interface JWTUser {
  id: string;
  email: string;
  name: string;
}

export const generateAccessToken = (user: JWTUser): string => {
  return jwt.sign(user, env.JWT_TOKEN_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_TOKEN_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });
};
