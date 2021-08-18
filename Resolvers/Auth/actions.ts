import { User } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { StoreType } from "../../redis";
import { generateCode, generateToken } from "../../utils/auth";
const config = {
    tokenExpiration:10*60, //seconds
    refreshTokenExpiration:7*24*60*60 //seconds
}
const Actions = (ctx:ExpressContext)=>{
    const store = ctx.req.quickStore as StoreType
    return {
        sendLoginCode:async (userId: string)=>{
            const code = generateCode(6)
            store.setTable(userId,`phone_number_verification_code`,code)
        },
        sendTokens:({role,userId}:{role:string,userId:string})=>{
            let token = generateToken({userId,role},`${config.tokenExpiration}s`)            
            let refreshToken = generateToken({userId,role},`${config.refreshTokenExpiration}s`)
            ctx.res.cookie('authorization',`${token}`,{httpOnly:true,sameSite:'none',secure:true})
            ctx.res.cookie('x-refresh-token',refreshToken,{httpOnly:true,sameSite:'none',secure:true})
        },
        destoryTokens:()=>{
            ctx.res.cookie('authorization',``,{httpOnly:true,sameSite:'none',secure:true,maxAge:0})
            ctx.res.cookie('x-refresh-token','',{httpOnly:true,sameSite:'none',secure:true,maxAge:0})
        }
    }
}
export default Actions

export type ActionsType = ReturnType<typeof Actions>;
