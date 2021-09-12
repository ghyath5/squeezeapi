import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { Resolver } from "type-graphql";
import { Extensions, Mutation, Arg, Ctx, NonEmptyArray } from "type-graphql";
import { Context } from "./../../@types/types";
import { UpdateUserResolver,User } from "../../prisma/generated/typegraphql";
import { sufficientRoles } from "../../utils/auth";
import { RateLimit } from "../CustomDecorators";
import { ChangeNumberResponse, UpdatePhoneNumberInput } from "./types";

@Resolver()
export class Mutations extends UpdateUserResolver{
  @RateLimit({window:30,max:1,errorMessage:'wait 30 seconds'})
  @Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&sufficientRoles(['USER'],roles)})
  @Mutation(()=>ChangeNumberResponse)
  async updatePhoneNumber(
    @Arg("newPhoneNumber") phoneNumber:string,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<ChangeNumberResponse>{
    let user = await prisma.user.findUnique({
      where:{
        phoneNumber
      }
    })
    if(user){
      throw new Error('phone number already in use')
    }
    ctx?.req.actions?.sendLoginCode(phoneNumber)
    return {
      isSuccess:true,
      message:'code sent'
    };
  }

  @Extensions({APP:true})
  @Mutation(()=>User)
  async verifyPhoneNumberChange(
    @Arg("UpdateInput") updatePhoneInputs:UpdatePhoneNumberInput,
    @Ctx() {prisma,ctx,userId}:Context
  ):Promise<User>{
    const {code,phoneNumber} = updatePhoneInputs
    let storedCode = await ctx?.req?.quickStore.get(`phone_number_verification_code:${userId}`)
    if(!storedCode) throw new Error("Incorrect code")

    const payloadCode = JSON.parse(storedCode)
    if(payloadCode.phoneNumber !== phoneNumber || !phoneNumber){
      throw new Error("Incorrect phoneNumber")
    }
    if(!payloadCode.code || payloadCode.code !== code || !code){
      throw new Error("Incorrect code")
    }
    return await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        loginConfirmedAt:{
          set:new Date()
        },
        phoneNumber:{
          set:phoneNumber
        }
      }
    })
  }
}

export default [Mutations] as NonEmptyArray<Function>