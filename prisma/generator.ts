import "reflect-metadata";
import { resolvers } from '@generated/type-graphql';
import { buildSchema } from 'type-graphql';
const generator = async ()=>{
    buildSchema({
        resolvers,
        validate: false,
        emitSchemaFile: {
            path: __dirname + "/schema.gql",
            sortedSchema: false, // by default the printed schema is sorted alphabetically
        },
        
    });
}
generator()