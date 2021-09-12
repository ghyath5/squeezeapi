import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import cors, { CorsOptions } from "cors";
import {  ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core';
import {buildSchema} from 'type-graphql'
import resolvers from './Resolvers'
import { arrayNotEmpty } from "class-validator";
import { applyMiddleware } from 'graphql-middleware';
import {  PrismaSelect } from '@paljs/plugins';
import {  GraphQLResolveInfo} from "graphql";
import { quickStore } from "./redis";
import cookieParser from 'cookie-parser'
import { sufficientRoles, verifyToken } from "./utils/auth";
import { Context } from "./@types/types";
import Actions from "./Resolvers/App/Auth/actions";
import { PruneSchema, wrapSchema } from '@graphql-tools/wrap';
import { FilterSchema } from "./limitIntrospection";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";
import depthLimit from 'graphql-depth-limit'
import { PrismaSelectFields } from "./middlewares";
const prisma = new PrismaClient();
// const middleware = async (resolve, root, args, context, info: GraphQLResolveInfo) => {
//   const result = new PrismaSelect(info).value;
//   if (Object.keys(result.select).length > 0) {
//     args = {
//       ...args,
//       ...result,
//     };
//   }
//   return resolve(root, args, context, info) 
// };
async function startApolloServer() {
  let schema = await buildSchema({
    resolvers,
    globalMiddlewares:[PrismaSelectFields()],
    authChecker:({context}:{context:Context},roles)=>{
      let req = context?.ctx?.req
      if(!req?.payload)return false;
      let hasRole = sufficientRoles(roles,req?.payload?.roles)
      if(!arrayNotEmpty(roles) || hasRole){
        return true
      }
      return false
    }
  });
  // schema = applyMiddleware(schema, middleware);
  const app = express();
  
  const corsOptions:CorsOptions = {credentials: true, origin: ['https://studio.apollographql.com','http://localhost:3000']}
  const server = new ApolloServer({
    formatError: (error) => {
      return {
        message:error.message,
        validationErrors:error.extensions?.exception?.validationErrors
      }
    },
    introspection:process.env.NODE_ENV !== 'production',
    schema,
    context: (ctx):Context => ({ prisma,ctx,userId:ctx?.req?.payload?.userId}),
    validationRules: [ depthLimit(3) ],
    plugins: [
      process.env.NODE_ENV === 'production' ?
      ApolloServerPluginLandingPageProductionDefault({ footer: false }) :
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),

      {
        requestDidStart: async () => ({
          async didResolveOperation({ request, document }) {
            /**
             * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
             * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
             */
            const complexity = getComplexity({
              // Our built schema
              schema,
              // To calculate query complexity properly,
              // we have to check only the requested operation
              // not the whole document that may contains multiple operations
              operationName: request.operationName,
              // The GraphQL query document
              query: document,
              // The variables for our GraphQL query
              variables: request.variables,
              // Add any number of estimators. The estimators are invoked in order, the first
              // numeric value that is being returned by an estimator is used as the field complexity.
              // If no estimator returns a value, an exception is raised.
              estimators: [
                // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                fieldExtensionsEstimator(),
                // Add more estimators here...
                // This will assign each field a complexity of 1
                // if no other estimator returned a value.
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            // Here we can react to the calculated complexity,
            // like compare it with max and throw error when the threshold is reached.
            if (complexity > 20) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`,
              );
            }
          },
        }),    
      },
    ]
  });
  await server.start();
  app.use(cors(corsOptions));
  app.use(cookieParser())
  app.use('/graphql',async (req,res,next)=>{
    let token = req?.cookies?.authorization
    await verifyToken({req,res},token)
    req.quickStore = quickStore({req,res})
    req.actions = Actions({req,res})
    const newSchema = wrapSchema({
      schema,
      transforms: [new FilterSchema(req),new PruneSchema()],
    });
    const schemaDerivedData = await (server as any).generateSchemaDerivedData(newSchema) as any
    (server as any).state.schemaManager.schemaDerivedData = schemaDerivedData
    next()
  })
  server.applyMiddleware({ app,cors:false });
  app.listen({ port:process.env.PORT||4000 }, ()=>console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))
}

startApolloServer()