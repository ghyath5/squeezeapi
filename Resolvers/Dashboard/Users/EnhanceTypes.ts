import { Extensions } from "type-graphql";
import { enhanceResolvers } from "../../../utils/helpers";


enhanceResolvers([
    'User._all'
],
[
    Extensions({ADMIN:true})
]
)