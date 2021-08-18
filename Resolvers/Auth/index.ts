import { PrismaClient, Role } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import {  Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql'
import {User} from '../../prisma/generated/typegraphql'
// import {  StoreType } from '../../redis';
// // import {  destoryTokens, sendTokens } from '../../utils/auth';
import { Guest } from '../CustomDecorators';
// import { sendSmsCode } from './actions';
import {  AuthResponse, LoginInputData, RegisterInputData } from './types';

@Resolver()
export class Auth {
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
          {phone_number:{equals:data.phone_number}}
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
      role:'UNCONFIRMED',
    });
    // if(!user.phoneNumberConfirmedAt){
      // send verification code
    ctx.req.actions?.sendLoginCode(user.id)
    // }
    return {
      message:'Code sent',
      isSuccess:true,
      isConfirmed:false
    }
  }

  @Guest()
  @Mutation(()=>AuthResponse)
  async login(
    @Arg("LoginInputData") data:LoginInputData,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<AuthResponse>{
    const {phone_number} = data
    const login = phone_number
    const user = await prisma.user.findFirst({
      where:{phone_number:{equals:login}}
    })
    if(!user || !phone_number) {
      throw new Error("No user found")
    }
    // let isPasswordCorrect = compareHashedPassword(password,user.password)
    // if(!isPasswordCorrect){
    //   return {
    //     message:'incorrect password',
    //     isSuccess:false
    //   }
    // }    
    ctx?.req?.actions?.sendTokens({
      userId:user.id,
      role:'UNCONFIRMED',
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
  
  @Authorized("UNCONFIRMED")
  @Mutation(()=>AuthResponse)
  async verifyOTP(
    @Arg("OTPcode") code:string,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<AuthResponse>{    
    let storedCode = await ctx?.req?.quickStore.getTable('phone_number_verification_code')
    if(storedCode != code){
      throw new Error("Incorrect code")
    }
    ctx?.req?.actions?.sendTokens({
      role:'USER',
      userId:ctx.req?.payload?.userId
    })
    let user = await prisma.user.findUnique({where:{id:ctx?.req?.payload?.userId}}) as User
    return {
      message:'Success',
      isSuccess:true,
      user,
      isConfirmed:true
    }
  }

  @Authorized()
  @Mutation(()=>Boolean)
  logout(@Ctx() {ctx}:{ctx:ExpressContext}):Boolean{
    ctx.req.actions.destoryTokens()
    return true
  }

  @Authorized(Role.USER)
  @Query(()=>User)
  async me(@Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}):Promise<User>{
    let me = await prisma.user.findUnique({where:{id:ctx.req.payload.userId}}) as User
    return me;
  }
}