import { Decimal } from "@prisma/client/runtime";
import { Extensions, Field, InputType, ObjectType } from "type-graphql";
import { OrderCreateInput } from "../../../prisma/generated/typegraphql";

@ObjectType()
export class MakeOrderResponse {
  @Field(()=>String,{nullable:true})
  message?:string
  
  @Field(()=>Boolean)
  isSuccess:Boolean
}

// @InputType({isAbstract:true})
export class OrderData extends OrderCreateInput {
  // @Field()
  cost: Decimal | number | string
}
