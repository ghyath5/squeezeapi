import { PrismaClient, Role, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import {  Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql'
import {  StoreType } from '../../redis';
import {  sendTokens } from '../../utils/auth';
import { sendSmsCode } from './actions';
import {  AuthResponse, LoginInputData, RegisterInputData } from './types';

@Resolver()
export class Auth {

  @Mutation(()=>AuthResponse)
  async register(
    @Arg("RegisterInputData") data:RegisterInputData,
    @Ctx() {prisma,ctx,quickStore}:{prisma:PrismaClient,ctx:ExpressContext,quickStore:StoreType}
  ): Promise<AuthResponse> {
    let user = await prisma.user.findFirst({
      where:{
        OR:[
          {email:{equals:data.email}},
          {phone_number:{equals:data.phone_number}}
        ]
      }
    })
    if(user){
      return {
        message:data.email==user.email?'email already in use':'phone number already in use',
        isSuccess:false
      }
    }
    // data.password = hashPassword(data.password)
    user = await prisma.user.create({data})
    sendTokens({
      userId:user.id,
      role:'UNCONFIRMED',
    },ctx);
    // if(!user.phoneNumberConfirmedAt){
      // send verification code
    sendSmsCode(user)
    // }
    return {
      message:'Code sent',
      isSuccess:true,
      isConfirmed:false
    }
  }


  @Mutation(()=>AuthResponse)
  async login(
    @Arg("LoginInputData") data:LoginInputData,
    @Ctx() {prisma,ctx,quickStore}:{prisma:PrismaClient,ctx:ExpressContext,quickStore:StoreType}
  ):Promise<AuthResponse>{
    const {phone_number} = data
    const login = phone_number
    const user = await prisma.user.findFirst({
      where:{phone_number:{equals:login}}
    })
    if(!user) {
      return {
        message:'no user found',
        isSuccess:false,
      }
    }
    // let isPasswordCorrect = compareHashedPassword(password,user.password)
    // if(!isPasswordCorrect){
    //   return {
    //     message:'incorrect password',
    //     isSuccess:false
    //   }
    // }
    sendTokens({
      userId:user.id,
      role:'UNCONFIRMED',
    },ctx);
    // if(!user.phoneNumberConfirmedAt){
      // send verification code
    sendSmsCode(user)
    // }
    return {
      message:'Code sent',
      isSuccess:true
    }    
  }
  
  @Authorized("UNCONFIRMED")
  @Mutation(()=>AuthResponse)
  async verifyOTP(
    @Arg("OTPcode") code:string,
    @Ctx() {prisma,ctx,quickStore}:{prisma:PrismaClient,ctx:ExpressContext,quickStore:StoreType}
  ):Promise<AuthResponse>{      
    let storedCode = await quickStore.getTable('phone_number_verification_code')
    if(storedCode != code){
      return {
        message:'incorrect code',
        isSuccess:false
      }
    }
    sendTokens({
      role:'USER',
      userId:ctx.req?.payload?.userId
    },ctx)
    let user = await prisma.user.findUnique({where:{id:ctx?.req?.payload?.userId}}) as User
    return {
      message:'Success',
      isSuccess:true,
      user
    }
  }

  @Query(()=>String)
  me():string{
    return 'Hi'
  }
}