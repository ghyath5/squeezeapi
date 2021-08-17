import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import {  ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core';
import {buildSchema} from 'type-graphql'
import resolvers from './Resolvers'
// import jwt from "jsonwebtoken";
import { arrayNotEmpty } from "class-validator";
import { applyMiddleware } from 'graphql-middleware';
import {  PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from "graphql";
import { quickStore } from "./redis";
import cookieParser from 'cookie-parser'
import { verifyToken } from "./utils/auth";

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
    authChecker:({context:{req},args,root},roles)=>{
      if(!req?.payload)return false;
      if(!arrayNotEmpty(roles) || roles.includes(req?.payload?.role)){
        return true
      }
      return false
    }
  });
  schema = applyMiddleware(schema, middleware);

  const server = new ApolloServer({
    formatError: (error) => {
      return {
        message:error.message,
        validationErrors:error.extensions?.exception?.validationErrors
      }
    },
    introspection:process.env.NODE_ENV !== 'production',
    schema,
    context: (ctx) => ({ prisma,ctx,quickStore:quickStore(ctx)}),
    plugins: [
      process.env.NODE_ENV === 'production' ?
      ApolloServerPluginLandingPageProductionDefault({ footer: false }) :
      ApolloServerPluginLandingPageLocalDefault({ footer: false })
    ]
  });
  await server.start();

  const app = express();
  // var corsOptions = {
  //   credentials: true
  // };
  // app.use(cors(corsOptions));
  app.use(cookieParser())
  app.use('/graphql',async (req,res,next)=>{
    if(!req?.cookies?.authorization)return next();
    let token = req?.cookies?.authorization
    
    await verifyToken({req,res},token)
    next()
  })
  server.applyMiddleware({ app });
  app.listen({ port:process.env.PORT||4000 }, ()=>console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))
}

startApolloServer()