import { Types } from "mongoose";
import { User } from "../models/user.model";

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./env";

export interface IUserToken 
extends Omit<
User, 
| "password" 
| "activationCode" 
| "isActive" 
| "email" 
| "profilePicture" 
| "fullName" 
| "username"
> {
    id?: Types.ObjectId;
}

export const generateToken = (user: IUserToken) => {
    const token = jwt.sign(user, SECRET_KEY,
        {
            expiresIn: '1h'
        }
    );
    return token;
};

export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET_KEY) as User;
    return user;
};