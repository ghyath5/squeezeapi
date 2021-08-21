import { Authorized, Extensions } from "type-graphql";
import {ServiceRelationsResolver,FindManyServiceResolver} from "../../prisma/generated/typegraphql";
import { sufficientRoles } from "../../utils/auth";



export default [FindManyServiceResolver,ServiceRelationsResolver]