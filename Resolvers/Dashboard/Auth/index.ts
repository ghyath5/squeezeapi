import { ExpressContext } from 'apollo-server-express';
import {  Arg, Authorized, Ctx, Extensions, Mutation, Resolver} from 'type-graphql'
import { Context } from '../../../@types/types';

import { generateToken, sufficientRoles } from '../../../utils/auth';
import { Guest, RateLimit } from '../../CustomDecorators';
import {  AdminAuthResponse, AdminLoginInputData } from './types';
import bcrypt from 'bcrypt';

@Resolver()
export class Auth {
  @Extensions({check:(isLoggedIn,roles)=>!isLoggedIn})
  @Guest()
  @Mutation(()=>AdminAuthResponse)
  async aLogin(
    @Arg("AdminLoginInputData") data:AdminLoginInputData,
    @Ctx() {prisma,ctx}:Context
  ):Promise<AdminAuthResponse>{
    const {login,password} = data
    if(!login || !password) {
      throw new Error("No user found")
    }
    const user = await prisma.user.findFirst({
      where:{
        email:{equals:login},
        role:{
          in:["ADMIN","MANAGER"]
        }
      }
    })
    if(!user || !user?.password){
      throw new Error("No user found")
    }
    let isSamePassword = bcrypt.compareSync(password, user.password);
    if(!isSamePassword){
      throw new Error("Wrong password")
    }
    let refreshToken = generateToken({userId:user.id},`7d`)
    let token = generateToken({userId:user.id,roles:[user.role]},`5m`)
    ctx.res.cookie('authorization',`${token}`,{httpOnly:true,sameSite:'none',secure:true})
    ctx.res.cookie('x-refresh-token',refreshToken,{httpOnly:true,sameSite:'none',secure:true})
    return {
      message:'Success',
      isSuccess:true
    }    
  }
  
  @Extensions({check:(isLoggedIn,roles)=>Boolean(isLoggedIn)})
  @Authorized()
  @Mutation(()=>Boolean)
  aLogout(@Ctx() {ctx}:{ctx:ExpressContext}):Boolean{
    ctx.req.actions.destoryTokens()
    return true
  }
}