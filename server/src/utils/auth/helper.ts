import { Response } from "express";

const cookieOptions = {
    httpOnly : true,
    secure : true,
    maxAge : 15 * 60 * 1000
}
export const setAuthCookies = (res:any, accessToken:string, refreshToken:string) => {
    res.cookie("accessToken", accessToken, cookieOptions)
    res.cookie("accessToken", refreshToken, cookieOptions)


}