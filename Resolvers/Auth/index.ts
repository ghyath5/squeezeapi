import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import {  Arg, Authorized, Ctx, Extensions, Mutation, Resolver} from 'type-graphql'
import { sufficientRoles } from '../../utils/auth';
import { Guest } from '../CustomDecorators';
import {  AuthResponse, LoginInputData, RegisterInputData, VerifyLoginResponse } from './types';


@Resolver()
export class Auth {
  @Extensions({check:(isLoggedIn,roles)=>!isLoggedIn})
  @Guest()
  @Mutation(()=>AuthResponse)
  async register(
    @Arg("RegisterInputData") data:RegisterInputData,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ): Promise<AuthResponse> {
    let user = await prisma.user.findFirst({
      where:{
        OR:[
          {email:{equals:data.email}},
          {phoneNumber:{equals:data.phoneNumber}}
        ]
      }
    })
    if(user){
      throw new Error(data.email==user.email?'email already in use':'phone number already in use')
    }
    // data.password = hashPassword(data.password)
    user = await prisma.user.create({data})
    ctx?.req?.actions?.sendTokens({
      userId:user.id,
      roles:['UNCONFIRMED'],
    });
    // if(!user.phoneNumberConfirmedAt){
      // send verification code
    ctx.req.actions?.sendLoginCode(user.id)
    // }
    return {
      message:'Code sent',
      isSuccess:true
    }
  }

  @Extensions({check:(isLoggedIn,roles)=>!isLoggedIn})
  @Guest()
  @Mutation(()=>AuthResponse)
  async login(
    @Arg("LoginInputData") data:LoginInputData,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<AuthResponse>{
    const {phoneNumber} = data
    const login = phoneNumber
    if(!phoneNumber) {
      throw new Error("No user found")
    }
    const user = await prisma.user.findFirst({
      where:{phoneNumber:{equals:login}}
    })
    if(!user){
      throw new Error("No user found")
    }   
    ctx?.req?.actions?.sendTokens({
      userId:user.id,
      roles:['UNCONFIRMED'],
    });
    // if(!user.phoneNumberConfirmedAt){
      // send verification code
    ctx.req.actions?.sendLoginCode(user.id)
    // }
    return {
      message:'Code sent',
      isSuccess:true
    }    
  }
  
  @Extensions({check:(isLoggedIn,roles)=>sufficientRoles(['UNCONFIRMED'],roles)})
  @Authorized("UNCONFIRMED")
  @Mutation(()=>VerifyLoginResponse)
  async verifyOTP(
    @Arg("OTPcode") code:string,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<VerifyLoginResponse>{    
    let storedCode = await ctx?.req?.quickStore.get(`phone_number_verification_code:${ctx.req?.payload?.userId}`)
    if(storedCode != code){
      throw new Error("Incorrect code")
    }
    ctx?.req?.actions?.sendTokens({
      roles:['USER'],
      userId:ctx.req?.payload?.userId
    })
    // let user = await prisma.user.findUnique({where:{id:ctx?.req?.payload?.userId}}) as User
    return {
      message:'Success',
      isSuccess:true
    }
  }

  @Extensions({check:(isLoggedIn,roles)=>sufficientRoles(['UNCONFIRMED'],roles)})
  @Authorized("UNCONFIRMED")
  @Mutation(()=>VerifyLoginResponse)
  async resendOTP(
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<VerifyLoginResponse>{
    let userId = ctx?.req?.payload?.userId
    ctx.req.actions?.sendLoginCode(userId)
    return {
      message:'Code sent',
      isSuccess:true
    }
  }

  @Extensions({check:(isLoggedIn,roles)=>Boolean(isLoggedIn)})
  @Authorized()
  @Mutation(()=>Boolean)
  logout(@Ctx() {ctx}:{ctx:ExpressContext}):Boolean{
    ctx.req.actions.destoryTokens()
    return true
  }
}