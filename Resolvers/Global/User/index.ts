import { PrismaSelect } from "@paljs/plugins";
import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import {  Ctx, Extensions, Info, NonEmptyArray, Query, Resolver } from "type-graphql";
import {  User,UserRelationsResolver} from "../../../prisma/generated/typegraphql";
import { sufficientRoles } from "../../../utils/auth";
@Resolver()
export class Queries extends UserRelationsResolver{
  @Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&!sufficientRoles(['UNCONFIRMED'],roles)})
  @Query(()=>User)
  async me(
    @Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext},
    @Info() info
  ):Promise<User>{
    const select = new PrismaSelect(info).value;
    let me = await prisma.user.findUnique({
      where:{id:ctx.req.payload.userId},
      ...select
    }) as User
    return me;
  }
}

export default [Queries] as NonEmptyArray<Function>