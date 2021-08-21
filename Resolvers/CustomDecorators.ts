import { createMethodDecorator, ResolverData, UseMiddleware } from "type-graphql";
import { Context } from "../@types/types";
export function Guest() {
    return createMethodDecorator(async ({context}:{context:Context}, next) => {
      if(context?.ctx?.req?.payload){
        throw Error("You already loggedIn")
      }  
      return next();
    });
}
export default function RateLimit({window, max, errorMessage}:{window:number,max:number,errorMessage?:string}) {

  return UseMiddleware(async ({ info:{variableValues, fieldName} , context}: {context:Context,info:any}, next) => {
      let visitorKey = context.userId ? "user:"+context.userId: "ip:"+context?.ctx?.req?.ip;
      const quickStore = context.ctx.req.quickStore
      // const variableKey = limitByVariables &&
      //     JSON.stringify(variableValues)
      //         .replace(/[^a-zA-Z0-9,]/g,"")
      //         .trim();
      visitorKey = visitorKey.replace(/:/ig,"-")
      const key:string = ["limit", fieldName, visitorKey].join("-");
      
      const oldRecord = await quickStore.get(key)
      if(oldRecord) {
        if(parseInt(oldRecord) > max){
            throw new Error(errorMessage || 'Rate Limit Exceeded')
        }else {
          quickStore.inc(key)
        }
      }else{        
        quickStore.set(key, "1", window);
      }
      return next();
  });
}