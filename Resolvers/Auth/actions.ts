import { PrismaClient, User } from "@prisma/client";
import { quickStore } from "../../redis";
import { generateCode } from "../../utils/auth";

const prisma = new PrismaClient()
const store = quickStore()
export const sendSmsCode = async (user:User)=>{
    //send verification code
    const code = generateCode(6)
    store.setTable(user.id,`phone_number_verification_code`,code)
}