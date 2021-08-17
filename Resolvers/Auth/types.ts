import {  IsEmail, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import {User} from '../../prisma/generated/typegraphql'

@InputType()
export class RegisterInputData {
  @Field()
  @IsEmail({})
  email:string

  @Field()
  phone_number:string

  @Field()
  @MinLength(2)
  name:string

}

//login input data
@InputType()
export class LoginInputData {
  @Field({nullable:true})
  phone_number:string  
}

@ObjectType()
export class AuthResponse{
    @Field(()=>User,{nullable:true})
    user?:User

    @Field(()=>Boolean,{nullable:true})
    isConfirmed?:Boolean

    @Field(()=>String,{nullable:true})
    message?:string

    @Field(()=>Boolean)
    isSuccess:Boolean
}