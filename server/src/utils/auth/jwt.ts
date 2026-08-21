import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../lib/constants.js";

interface JWTUser {
  id: string;
  email: string;
  name: string;
}

export const generateAccessToken = (user: JWTUser): string => {
  console.log(user);
  return jwt.sign(user, env.JWT_TOKEN_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: object): string => {
  console.log(payload)
  return jwt.sign(payload, env.JWT_TOKEN_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });
};

// export const verifyRefreshToken = (token: string) => {
//   return jwt.verify(
//     token,
//     env.JWT_TOKEN_REFRESH_SECRET as string
//   );
// };