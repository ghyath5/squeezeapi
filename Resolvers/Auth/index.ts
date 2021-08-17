import { PrismaClient, Role } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import {  Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql'
import {  storeType } from '../../redis';
import { compareHashedPassword, hashPassword, sendTokens } from '../../utils/auth';
import { sendSmsCode } from './actions';
import {  AuthResponse, LoginInputData, RegisterInputData } from './types';


@Resolver()
export class Auth {


  @Mutation(()=>AuthResponse)
  async register(
    @Arg("RegisterInputData") data:RegisterInputData,
    @Ctx() {prisma,ctx,quickStore}:{prisma:PrismaClient,ctx:ExpressContext,quickStore:storeType}
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
    data.password = hashPassword(data.password)
    user = await prisma.user.create({data})
    sendTokens({
      userId:user.id,
      role:Role.USER,
    },ctx);
    if(!user.phoneNumberConfirmedAt){
      // send verification code
      sendSmsCode(user)
    }
    return {
      message:'Success',
      isSuccess:true,
      user,
      isConfirmed:Boolean(user.phoneNumberConfirmedAt)
    }
  }


  @Mutation(()=>AuthResponse)
  async login(
    @Arg("LoginInputData") data:LoginInputData,
    @Ctx() {prisma,ctx,quickStore}:{prisma:PrismaClient,ctx:ExpressContext,quickStore:storeType}
  ):Promise<AuthResponse>{
    const {email,password,phone_number} = data
    const login = email || phone_number
    const user = await prisma.user.findFirst({
      where:{
        OR:[
          {email:{equals:login}},
          {phone_number:{equals:login}}
        ]
      }
    })
    if(!user?.password) {
      return {
        message:'no user found',
        isSuccess:false,
      }
    }
    let isPasswordCorrect = compareHashedPassword(password,user.password)
    if(!isPasswordCorrect){
      return {
        message:'incorrect password',
        isSuccess:false
      }
    }
    sendTokens({
      userId:user.id,
      role:Role.USER,
    },ctx);
    if(!user.phoneNumberConfirmedAt){
      // send verification code
      sendSmsCode(user)
    }
    return {
      message:'Success',
      isSuccess:true,
      user,
      isConfirmed:Boolean(user.phoneNumberConfirmedAt)
    }
    
  }
}