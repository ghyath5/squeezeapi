import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import {  Ctx, Extensions, NonEmptyArray, Query, Resolver } from "type-graphql";
import {  User,UserRelationsResolver} from "../../../prisma/generated/typegraphql";
import { sufficientRoles } from "../../../utils/auth";


@Resolver()
export class Queries extends UserRelationsResolver{
  @Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&!sufficientRoles(['UNCONFIRMED'],roles)})
  @Query(()=>User)
  async me(@Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}):Promise<User>{
    let me = await prisma.user.findUnique({where:{id:ctx.req.payload.userId}}) as User
    return me;
  }
}

export default [Queries] as NonEmptyArray<Function>