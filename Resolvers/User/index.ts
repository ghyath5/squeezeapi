import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import {  Arg, Authorized, Ctx, Extensions, Mutation, NonEmptyArray, Query, Resolver, UseMiddleware } from "type-graphql";
import { Context } from "../../@types/types";
import { AuthorizeSelf } from "../../middlewares";
import { Role, User,UpdateUserResolver,applyResolversEnhanceMap, applyInputTypesEnhanceMap, applyModelsEnhanceMap } from "../../prisma/generated/typegraphql";
import { sufficientRoles } from "../../utils/auth";
import { applyDecoratorsFields } from "../../utils/helpers";
import { ChangeNumberResponse, UpdatePhoneNumberInput } from "./types";
const ACCESS_FIELDS_ROLES = ['ADMIN','MANAGER']

applyResolversEnhanceMap({
  User:{
    updateUser:[Authorized(['USER',...ACCESS_FIELDS_ROLES]),UseMiddleware(AuthorizeSelf),Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&!sufficientRoles(['UNCONFIRMED'],roles)})]
  }
})

const hiddenInputFields = applyDecoratorsFields(['phoneNumber','loginConfirmedAt','updatedAt','createdAt','role','id'],Extensions({hide:true}))
applyInputTypesEnhanceMap({
  UserUpdateInput:{
    fields:hiddenInputFields
  }
})

@Resolver()
export class Queries extends UpdateUserResolver{
  @Query(()=>String)
  root():String{
    return 'Root';
  }
  @Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&!sufficientRoles(['UNCONFIRMED'],roles)})
  @Authorized(Role.USER)
  @Query(()=>User)
  async me(@Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}):Promise<User>{
    let me = await prisma.user.findUnique({where:{id:ctx.req.payload.userId}}) as User
    return me;
  }
}

@Resolver()
export class Mutations {
  @Authorized(Role.USER)
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

  @Authorized(Role.USER)
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


export default [Mutations,Queries] as NonEmptyArray<Function>