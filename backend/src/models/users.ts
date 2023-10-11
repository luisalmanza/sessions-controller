import { Schema, model } from "mongoose";
import UserInterface from "../interfaces/user.interface";

const UserSchema = new Schema<UserInterface>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

export default model<UserInterface>("users", UserSchema);