import { ExpressContext } from 'apollo-server-express'
import * as jwt from 'jsonwebtoken'
// import * as bcrypt from 'bcrypt'
// import { Request } from 'express-serve-static-core'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
const config = {
    tokenExpiration:10*60, //seconds
    refreshTokenExpiration:7*24*60*60 //seconds
}
export const generateToken = (payload: string | object | Buffer,expiresIn: string)=>{
    let token = jwt.sign(payload,process.env.APP_SECRET as string,{algorithm:'HS256',expiresIn})
    return token
}

export const sendTokens = ({role,userId}:{role:string,userId:string},ctx:ExpressContext)=>{
    let token = generateToken({userId,role},`${config.tokenExpiration}s`)
    let refreshToken = generateToken({userId,role},`${config.refreshTokenExpiration}s`)
    ctx.res.cookie('authorization',`${token}`,{httpOnly:true,sameSite:'none',secure:true})
    ctx.res.cookie('x-refresh-token',refreshToken,{httpOnly:true,sameSite:'none',secure:true})
}
// export const hashPassword =  (password: string | Buffer)=>{
//     return bcrypt.hashSync(password, 6)
// }

// export const compareHashedPassword = (password: string | Buffer,hash: string)=>{
//     return bcrypt.compareSync(password,hash)
// }

export const verifyToken = async (ctx:ExpressContext,token: string):Promise<Boolean | jwt.JwtPayload>=>{
    try{
        let payload = jwt.verify(token, (process.env.APP_SECRET as string)) as jwt.JwtPayload
        ctx.req.payload = payload
        return payload;
      }catch(e){
        if(e.message == 'jwt expired'){
          let refreshtoken = ctx.req?.cookies['x-refresh-token']
          if(!refreshtoken)return false;
          try{
            let payload = jwt.verify(refreshtoken,(process.env.APP_SECRET as string)) as jwt.JwtPayload
            let user = await prisma.user.findUnique({where:{id:payload?.userId}})
            if(!user)return false;            
            ctx.req.payload = payload
            sendTokens({
                userId:user.id,
                role:payload.role,
            },ctx)
            return payload;
          }catch(e){
            return false
          }
        }        
        return false
    }
}


export const generateCode = (len: number):string=>{
  let num = ((Math.random() * 9 + 1) * Math.pow(10,len-1))
  return num.toFixed()
}