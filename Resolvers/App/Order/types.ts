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

export interface OrderData extends OrderCreateInput {
  cost:string | number | Decimal
}
