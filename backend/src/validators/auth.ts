import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

const validatorRegister = [
    check("name").exists().notEmpty(),
    check("password").exists().notEmpty(),
    check("email").exists().notEmpty().isEmail(),
    check("role").exists().notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        return validateResults(req, res, next);
    }
];

const validatorLogin = [
    check("password").exists().notEmpty(),
    check("email").exists().notEmpty().isEmail(),
    (req: Request, res: Response, next: NextFunction) => {
        return validateResults(req, res, next);
    }
];

function validateResults(req: Request, res: Response, next: NextFunction): void {
    try {
        validationResult(req).throw();
        return next();
    } catch (error: any) {
        res.status(403);
        res.send({ errors: error.array() });
    }
}

export { validatorLogin, validatorRegister };