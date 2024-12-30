import { tokenExpiresIn, SECRET_KEY } from "@config";
import { sign } from "jsonwebtoken";


export function generateAuthToken(userId: string) {
    return sign({ _id: userId }, SECRET_KEY, { expiresIn: tokenExpiresIn })
}