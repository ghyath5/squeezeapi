import { createMethodDecorator } from "type-graphql";
import { Context } from "../@types/types";

export function Guest() {
    return createMethodDecorator(async ({context}:{context:Context}, next) => {
      if(context?.ctx?.req?.authenticated){
        throw Error("You already loggedIn")
      }  
      return next();
    });
}