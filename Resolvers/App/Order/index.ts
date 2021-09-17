import './EnhanceTypes'
import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { Resolver } from "type-graphql";
import { Extensions, Mutation, Arg, Ctx, NonEmptyArray } from "type-graphql";
import { OrderCreateInput,Order } from "../../../prisma/generated/typegraphql";
import { MakeOrderResponse, OrderData } from "./types";
import { Fields } from '../../CustomDecorators';

@Resolver()
export class Mutations{
  @Extensions({APP:true})
  @Mutation(()=>Order)
  async makeOrder(
    @Fields() fields,
    @Arg("createOrderInput") orderDataInput:OrderCreateInput,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<Order>{
    let orderData = {...orderDataInput} as OrderData
    orderData.status = 'In_progress'
    orderData.user = {connect:{id:ctx.req.payload.userId}}
    orderData.cost = 2.4    
    let order = await prisma.order.create({
      data:orderData,
      ...fields
    })    
    return order
  }
}

export default [Mutations] as NonEmptyArray<Function>