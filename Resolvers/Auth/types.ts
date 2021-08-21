import {  IsEmail } from "class-validator";
import { Extensions, Field, InputType, ObjectType } from "type-graphql";
import { sufficientRoles } from "../../utils/auth";

@ObjectType()
class CommonAuthResponse {
  @Field(()=>String,{nullable:true})
  message?:string
  
  @Field(()=>Boolean)
  isSuccess:Boolean
}

@Extensions({check:(isLoggedIn,roles)=>!isLoggedIn})
@InputType()
export class RegisterInputData {
  @Field()
  @IsEmail({})
  email:string

  @Field()
  phone_number:string

  @Field()
  firstName:string

  @Field()
  lastName:string
}

@Extensions({check:(isLoggedIn,roles)=>!isLoggedIn})
@InputType()
export class LoginInputData {
  @Field()
  phone_number:string  
}

@Extensions({check:(isLoggedIn,roles)=>!isLoggedIn})
@ObjectType()
export class AuthResponse extends CommonAuthResponse{}

@Extensions({check:(isLoggedIn,roles)=>sufficientRoles(['UNCONFIRMED'],roles)})
@ObjectType()
export class VerifyLoginResponse extends CommonAuthResponse{
}