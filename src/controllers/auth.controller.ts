import { Request, Response } from "express";

import * as Yup from 'yup';


import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type TLogin = {
    identifier: string;
    password: string;
}

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
        'at-least-one-uppercase-letter', 
        "Contains at least one uppercase letter", 
        (value) => {
        if (!value) return false;
        const regex = /[A-Z]/;
        return regex.test(value);
    })
    .test(
        'at-least-one-number', 
        "Contains at least one number", 
        (value) => {
        if (!value) return false;
        const regex = /\d/;
        return regex.test(value);
    }),
    confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), ""], "password must match")
})

export default {
    async register (req: Request, res: Response) {
        /**
         * #swagger.tags = ['Auth']
         */
        const {
            username,
            fullName,
            email,
            password,
            confirmPassword
        } = req.body as unknown as TRegister;

        try {
            await registerValidateSchema.validate({
            fullName, username, email, password, confirmPassword
            });

            const result = await UserModel.create({
                fullName,
                email,
                username,
                password,
            })

            res.status(200).json({
                message: 'Registration Successful',
                data: result
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            })
        }
    },

    async login (req: Request, res: Response) {
        /**
         * #swagger.tags = ['Auth']
         */

        const {identifier, password} = req.body as unknown as TLogin
        try {
            // Ambil data user berdasarkan identifier
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    },
                ],
                isActive: true
            })

            if(!userByIdentifier) {
                return res.status(403).json({
                    message: "User not found",
                    data: null
                })
            }

            // Validasi password
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password
            if(!validatePassword) {
                return res.status(401).json({
                    message: "Invalid password",
                    data: null
                })
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role
            });

            return res.status(200).json({
                message: "Login successful",
                data: token,
            })

        } catch (error) {
            const err = error as unknown as Error;

            res.status(400).json  ( {
                message: err.message,
                data: null,
            })
        }
    },

    async me (req: IReqUser, res: Response) {
        /**
         #swagger.tags = ['Auth']
         #swagger.security = [{
         "bearerAuth": []
         }]
         */
        try {
            const user = req.user;

            const result = await UserModel.findById(user?.id)

            return res.status(200).json ({
                message: "Success getting user profile",
                data: result,
            })

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            })
        }
    },
    async activation(req: Request, res: Response) {
        /**
         #swagger.tags = ['Auth']
         #swagger.requestBody = {
            required: true,
             content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ActivationRequest"}
                }
             }
        }
         */
        try {
            const { code} = req.body as { code: string };

            const user = await UserModel.findOneAndUpdate({
                activationCode: code,
            }, 
            {
                isActive: true
            },
            {
                new: true
            }
        );
        res.status(200).json({
            message: "Account activated successfully",
            data: user,
        });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            })
        }
    }
}