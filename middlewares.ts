import { GraphQLResolveInfo } from "graphql";
import { MiddlewareFn } from "type-graphql";
import { Context } from "./@types/types";
import { sufficientRoles } from "./utils/auth";

// export const UnupdatableFields: MiddlewareFn<any> = async ({ context, info,args,root, }:{context:Context,info:GraphQLResolveInfo,args:any,root:any}, next) => {
//     const payload = context?.ctx?.req?.payload
//     const myRoles = payload?.roles
//     let hasRoles = sufficientRoles(['USER'],myRoles)
//     if(hasRoles){
//         args.where.id = context?.ctx.req?.payload?.userId
//     }
//     return next();
// };

export function AuthorizeSelf(modelField = 'id' as string): MiddlewareFn<any> {
    return async ({args,context,info,root}:{context:Context,info:GraphQLResolveInfo,args:any,root:any}, next) => {
        const payload = context?.ctx?.req?.payload
        if(!payload)throw new Error("Not Auth")
        const myRoles = payload?.roles
        let hasRoles = sufficientRoles(['USER'],myRoles)
        if(hasRoles){
            args.where[modelField] = context?.ctx.req?.payload?.userId
        }
        return next();
    };
  }