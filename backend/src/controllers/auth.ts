import { Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import userModel from "../models/users";
import { sign } from "jsonwebtoken";
import { matchedData } from "express-validator";

async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const request = matchedData(req);
        const password = await hash(request.password, 10);
        const body = { ...request, password };
        const userData = await userModel.create(body);
        userData.set("password", undefined, { strict: false });

        const data = {
            user: userData
        };

        res.status(201);
        res.send({ data });
    } catch (error) {
        res.status(500);
        res.send({ error: "Error creating a user" })
    }
}

async function userLogin(req: Request, res: Response): Promise<void> {
    try {
        const request = matchedData(req);
        const user = await userModel.findOne({ email: request.email }).select("name email password role");

        if (!user) {
            res.status(404);
            res.send({ error: "User not exists" });
            return;
        }

        const hashPassword = user.get("password");
        const check = await compare(request.password, hashPassword);

        if (!check) {
            res.status(401);
            res.send({ error: "Invalid password" });
            return;
        }

        user.set("password", undefined, { strict: false });

        const token = sign(
            {
                email: user.email,
                role: user.role
            },
            <string>process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        const data = { token, user, expiresIn: 3600 };
        res.status(200);
        res.send({ data });
    } catch (error) {
        res.status(401);
        res.send({ error: "Invalid authentication credentials" })
    }
}

export { registerUser, userLogin };