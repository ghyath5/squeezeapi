import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import {  Arg, Authorized, Ctx, Extensions, Mutation, Resolver} from 'type-graphql'
import { Context } from '../../@types/types';
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
          ...[data.email?{email:{equals:data.email}}:{}],
          {phoneNumber:{equals:data.phoneNumber}}
        ]
      }
    })
    if(user){
      throw new Error(data.phoneNumber==user.phoneNumber?'phone number already in use':'email already in use')
    }
    // data.password = hashPassword(data.password)
    user = await prisma.user.create({data})
    ctx?.req?.actions?.sendTokens({
      userId:user.id,
      roles:['UNCONFIRMED'],
    });
    // if(!user.phoneNumberConfirmedAt){
      // send verification code
    ctx.req.actions?.sendLoginCode(user.phoneNumber,user.id)
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
    @Ctx() {prisma,ctx}:Context
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
    @Ctx() {prisma,ctx,userId}:Context
  ):Promise<VerifyLoginResponse>{
    let storedCode = await ctx?.req?.quickStore.get(`phone_number_verification_code:${userId}`)
    if(!storedCode)throw new Error("Incorrect code")

    const payloadCode = JSON.parse(storedCode)
    
    if(!payloadCode.code || payloadCode.code !== code || !code){
      throw new Error("Incorrect code")
    }
    prisma.user.update({
      where:{
        id:userId
      },
      data:{
        loginConfirmedAt:{
          set:new Date()
        }
      }
    })
    ctx?.req?.actions?.sendTokens({
      roles:['USER'],
      userId
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
    @Ctx() {prisma,ctx,userId}:Context
  ):Promise<VerifyLoginResponse>{
    const user = await prisma.user.findUnique({
      where:{id:userId}
    })
    if(!user){
      ctx.req?.actions?.destoryTokens()
      throw new Error("User not found")
    }
    ctx.req.actions?.sendLoginCode(user.phoneNumber)
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