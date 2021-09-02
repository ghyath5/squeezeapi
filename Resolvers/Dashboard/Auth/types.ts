import {  Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class AdminLoginInputData {
  @Field()
  login:string
  
  @Field()
  password:string
}

@ObjectType()
export class AdminAuthResponse {
  @Field(()=>String,{nullable:true})
  message?:string
  
  @Field(()=>Boolean)
  isSuccess:Boolean
}