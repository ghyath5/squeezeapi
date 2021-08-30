import {  Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class UpdatePhoneNumberInput{
    @Field()
    phoneNumber:string

    @Field()
    code:string
}

@ObjectType()
export class ChangeNumberResponse{
    @Field()
    message:string

    @Field()
    isSuccess:boolean
}