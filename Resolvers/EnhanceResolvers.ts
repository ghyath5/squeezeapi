import { Authorized, UseMiddleware, Extensions } from "type-graphql"
import { AuthorizeSelf } from "../middlewares"
import { applyInputTypesEnhanceMap, applyRelationResolversEnhanceMap, applyResolversEnhanceMap } from "../prisma/generated/typegraphql"
import { sufficientRoles } from "../utils/auth"
import { applyDecoratorsFields } from "../utils/helpers"

const ACCESS_FIELDS_ROLES = ['ADMIN','MANAGER']

applyResolversEnhanceMap({
  User:{
    updateUser:[Authorized(['USER',...ACCESS_FIELDS_ROLES]),UseMiddleware(AuthorizeSelf),Extensions({check:(isLoggedIn,roles)=>isLoggedIn&&!sufficientRoles(['UNCONFIRMED'],roles)})]
  }
})

const hiddenInputFields = applyDecoratorsFields(['phoneNumber','loginConfirmedAt','updatedAt','createdAt','role','id'],Extensions({hide:true}))
applyInputTypesEnhanceMap({
  UserUpdateInput:{
    fields:hiddenInputFields
  }
})

applyRelationResolversEnhanceMap({
  Step:{
    services:[Extensions({hide:true})]
  }
})
