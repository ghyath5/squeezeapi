import './EnhanceTypes'
import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { Resolver } from "type-graphql";
import { Extensions, Mutation, Arg, Ctx, NonEmptyArray } from "type-graphql";
import { OrderCreateInput,Order } from "../../../prisma/generated/typegraphql";
import { MakeOrderResponse } from "./types";

@Resolver()
export class Mutations{
  @Extensions({APP:true})
  @Mutation(()=>Order)
  async makeOrder(
    @Arg("createOrderInput") orderData:OrderCreateInput,
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}
  ):Promise<Order>{
    orderData.status = 'In_progress'
    orderData.user = {connect:{id:ctx.req.payload.userId}}
    let order = await prisma.order.create({
        data:orderData,
    })
    
    return order
  }
}

export default [Mutations] as NonEmptyArray<Function>