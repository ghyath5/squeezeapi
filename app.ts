import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import cors, { CorsOptions } from "cors";
import {  ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core';
import {buildSchema} from 'type-graphql'
import resolvers from './Resolvers'
// import jwt from "jsonwebtoken";
import { arrayNotEmpty } from "class-validator";
import { applyMiddleware } from 'graphql-middleware';
import {  PrismaSelect } from '@paljs/plugins';
import {  GraphQLResolveInfo} from "graphql";
import { quickStore } from "./redis";
import cookieParser from 'cookie-parser'
import { sufficientRoles, verifyToken } from "./utils/auth";
import { Context } from "./@types/types";
import Actions from "./Resolvers/Auth/actions";
import { PruneSchema, wrapSchema } from '@graphql-tools/wrap';
import { FilterSchema } from "./limitIntrospection";

const prisma = new PrismaClient();
const middleware = async (resolve, root, args, context, info: GraphQLResolveInfo) => {
  const result = new PrismaSelect(info).value;
  if (Object.keys(result.select).length > 0) {
    args = {
      ...args,
      ...result,
    };
  }
  return resolve(root, args, context, info);
};
async function startApolloServer() {
  let schema = await buildSchema({
    resolvers,
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
  schema = applyMiddleware(schema, middleware);
  const app = express();
  
  const corsOptions:CorsOptions = {credentials: true, origin: 'https://studio.apollographql.com'}
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
    plugins: [
      process.env.NODE_ENV === 'production' ?
      ApolloServerPluginLandingPageProductionDefault({ footer: false }) :
      ApolloServerPluginLandingPageLocalDefault({ footer: false })
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