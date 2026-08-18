import {email, string, z} from "zod";

export const registerUserSchema = z.object({
    name : z.string().min(1, "name cannot be empty"),
    email : z.email(),
    password : z.string().min(6,"password must be atleast 2 characters long")
}).strict()

export const loginUserSchema = z.object({
    email : z.email(),
    password : z.string().min(6,"password must be atleast 2 characters long")
}).strict()

export type RegisterInput = z.infer<typeof registerUserSchema>
export type loginUserSchema = z.infer<typeof loginUserSchema>