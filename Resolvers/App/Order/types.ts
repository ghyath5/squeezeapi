import { Extensions, Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class MakeOrderResponse {
  @Field(()=>String,{nullable:true})
  message?:string
  
  @Field(()=>Boolean)
  isSuccess:Boolean
}

// @InputType()
// export class RegisterInputData {
//   @Field({nullable:true})
//   email?:string

//   @Field()
//   phoneNumber:string

//   @Field()
//   firstName:string

//   @Field()
//   lastName:string
// }

// @InputType()
// export class LoginInputData {
//   @Field()
//   phoneNumber:string  
// }
