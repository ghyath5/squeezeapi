import { ExpressContext } from 'apollo-server-express'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { stringify } from 'querystring'
const config = {
    tokenExpiration:10*60, //seconds
    refreshTokenExpiration:7*24*60*60 //seconds
}
export const generateToken = (payload: string | object | Buffer,expiresIn: string)=>{
    let token = jwt.sign(payload,process.env.APP_SECRET as string,{algorithm:'HS256',expiresIn})
    return token
}

export const sendTokens = (payload: string | object | Buffer,ctx:ExpressContext)=>{
    let token = generateToken(payload,`${config.tokenExpiration}s`)
    let refreshToken = generateToken(payload,`${config.refreshTokenExpiration}s`)
    ctx.res.cookie('authorization',token,{httpOnly:true})
    ctx.res.cookie('x-refresh-token',refreshToken,{httpOnly:true})
}

export const hashPassword =  (password: string | Buffer)=>{
    return bcrypt.hashSync(password, 6)
}

export const compareHashedPassword = (password: string | Buffer,hash: string)=>{
    return bcrypt.compareSync(password,hash)
}

export const generateNumberBetween = (min: number,max: number)=>{
    return Math.random() * (max - min) + min;
}

export const generateCode = (len: number):string=>{
    let num = ((Math.random() * 9 + 1) * Math.pow(10,len-1))
    return num.toFixed()
}