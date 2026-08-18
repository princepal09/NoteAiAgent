import bcrypt from 'bcrypt'

export const encyrptPassword = async (password : string) =>{
    return await bcrypt.hash(password, 12);

}

export const comparePassword = async(password : string, hashedPassword : string) =>{
    return await bcrypt.compare(password, hashedPassword);
}