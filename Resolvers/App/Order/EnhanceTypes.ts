import { Authorized, UseMiddleware, Extensions } from "type-graphql";
import { AuthorizeSelf } from "../../../middlewares";
import {
  applyInputTypesEnhanceMap,
} from "../../../prisma/generated/typegraphql";
import { applyDecoratorsFields, enhanceHideInputClass, enhanceInputOnlyConnect, enhanceInputTypes, enhanceRelationResolvers, enhanceResolvers, showFieldsOnlyFor } from "../../../utils/helpers";


const hiddenInputFieldsUserUpdateInput = applyDecoratorsFields(
  ["id","status"],
  Extensions({ hide: true })
);
applyInputTypesEnhanceMap({
    OrderCreateInput: {
        fields: hiddenInputFieldsUserUpdateInput,
    },
});

enhanceInputOnlyConnect([
    'AddressCreateNestedOneWithoutOrdersInput',
    'ServiceCreateNestedOneWithoutOrdersInput'
])
enhanceHideInputClass(['UserCreateNestedOneWithoutOrdersInput'])
