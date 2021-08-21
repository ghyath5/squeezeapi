import { Authorized, Extensions } from "type-graphql";
import {ServiceRelationsResolver,FindManyServiceResolver, applyResolversEnhanceMap} from "../../prisma/generated/typegraphql";
import { sufficientRoles } from "../../utils/auth";
import RateLimit from "../CustomDecorators";

applyResolversEnhanceMap({
    Service:{
        services:[RateLimit({window:30,max:2})]
    }
})

export default [FindManyServiceResolver,ServiceRelationsResolver]