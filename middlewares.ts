import { GraphQLResolveInfo } from "graphql";
import { MiddlewareFn } from "type-graphql";
import { Context } from "./@types/types";
import { sufficientRoles } from "./utils/auth";

export const AuthorizeSelf: MiddlewareFn<any> = async ({ context, info,args,root, }:{context:Context,info:GraphQLResolveInfo,args:any,root:any}, next) => {
    const payload = context?.ctx?.req?.payload
    if(!payload)throw new Error("Not Auth")
    const myRoles = payload?.roles
    let hasRoles = sufficientRoles(['USER'],myRoles)
    if(hasRoles){
        args.where.id = context?.ctx.req?.payload?.userId
    }
    return next();
};