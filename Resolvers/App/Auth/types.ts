import {  IsEmail } from "class-validator";
import { Extensions, Field, InputType, ObjectType } from "type-graphql";
import { sufficientRoles } from "../../../utils/auth";

@ObjectType()
class CommonAuthResponse {
  @Field(()=>String,{nullable:true})
  message?:string
  
  @Field(()=>Boolean)
  isSuccess:Boolean
}

@InputType()
export class RegisterInputData {
  @Field({nullable:true})
  email?:string

  @Field()
  phoneNumber:string

  @Field()
  firstName:string

  @Field()
  lastName:string
}

@InputType()
export class LoginInputData {
  @Field()
  phoneNumber:string  
}

@ObjectType()
export class AuthResponse extends CommonAuthResponse{}


@ObjectType()
export class VerifyLoginResponse extends CommonAuthResponse{
}