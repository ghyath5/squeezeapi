import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import {  Authorized, Ctx, Extensions, Query, Resolver, UseMiddleware } from "type-graphql";
import { AuthorizeSelf } from "../../middlewares";
import { Role, User,UpdateUserResolver,applyResolversEnhanceMap, applyModelsEnhanceMap } from "../../prisma/generated/typegraphql";

import { sufficientRoles } from "../../utils/auth";


applyResolversEnhanceMap({
  User:{
    updateUser:[Authorized(['USER']),UseMiddleware(AuthorizeSelf),Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&!sufficientRoles(['UNCONFIRMED'],roles)})]
  }
})


@Resolver()
export class Me extends UpdateUserResolver{
  @Query(()=>String)
  root():String{
    return 'Root';
  }
  @Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&!sufficientRoles(['UNCONFIRMED'],roles)})
  @Authorized(Role.USER)
  @Query(()=>User)
  async me(@Ctx() {prisma,ctx}:{prisma:PrismaClient,ctx:ExpressContext}):Promise<User>{
    let me = await prisma.user.findUnique({where:{id:ctx.req.payload.userId}}) as User
    return me;
  }  
}

