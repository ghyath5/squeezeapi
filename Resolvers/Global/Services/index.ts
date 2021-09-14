
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Context } from "../../../@types/types";
import {FindManyServiceResolver, StepRelationsResolver,FindManyStepResolver, StepOptionRelationsResolver, StepOption} from "../../../prisma/generated/typegraphql";
import { customizeOptionsSettings } from "./utils";


@Resolver(of => StepOption)
class Options {
    @FieldResolver(()=>Object)
    settings(
        @Root() option: StepOption,
        @Ctx() ctx : Context
    ):Object {        
        return customizeOptionsSettings(option,ctx)
    }
}

export default [FindManyServiceResolver,StepRelationsResolver,FindManyStepResolver,StepOptionRelationsResolver,Options]