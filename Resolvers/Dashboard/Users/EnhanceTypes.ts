import { Extensions } from "type-graphql";
import { enhanceResolvers } from "../../../utils/helpers";


enhanceResolvers([
    'User.users'
],
[
    Extensions({ADMIN:true})
]
)