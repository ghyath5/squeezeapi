import { Authorized, UseMiddleware, Extensions } from "type-graphql";
import { AuthorizeSelf } from "../middlewares";
import {
  applyInputTypesEnhanceMap,
} from "../prisma/generated/typegraphql";
import { applyDecoratorsFields, enhanceInputTypes, enhanceRelationResolvers, enhanceResolvers, showFieldsOnlyFor } from "../utils/helpers";

const ACCESS_FIELDS_ROLES = ["ADMIN", "MANAGER"];

enhanceResolvers(
  ['Order._all'],
  [showFieldsOnlyFor(ACCESS_FIELDS_ROLES)]
)
enhanceResolvers(
  ['User.updateUser'],
  [
    Authorized(["USER"]),
    UseMiddleware(AuthorizeSelf()),
    showFieldsOnlyFor(['USER'])
  ]
)
enhanceRelationResolvers(
  [
    'Step.services'
  ],
  [Extensions({ hide: true })]
)
const hiddenInputFieldsUserUpdateInput = applyDecoratorsFields(
  ["phoneNumber", "loginConfirmedAt", "role", "id","orders","points"],
  Extensions({ hide: true })
);
applyInputTypesEnhanceMap({
  UserUpdateInput: {
    fields: hiddenInputFieldsUserUpdateInput,
  },
});

enhanceInputTypes(
  ['AddressUpdateManyWithoutUserInput.fields.upsert'],
  [showFieldsOnlyFor(['ADMIN','USER','MANAGER'])]
)
enhanceInputTypes(
    [
      'AddressUpdateManyWithoutUserInput.fields._all',
      'OrderCreateNestedManyWithoutAddressInput.class',
      'OrderUpdateManyWithoutAddressInput.class',
      'AddressUpdateWithoutUserInput.fields.updatedAt',
      'AddressUpdateWithoutUserInput.fields.createdAt',
      'AddressCreateWithoutUserInput.fields.createdAt',
      'AddressCreateWithoutUserInput.fields.updatedAt',
    ],
    [
      Extensions({ hide: true }),
      Authorized(ACCESS_FIELDS_ROLES),
    ]
)