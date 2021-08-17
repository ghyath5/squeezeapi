import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import {buildSchema} from 'type-graphql'
import resolvers from './Resolvers'
import jwt from "express-jwt";
import { arrayNotEmpty } from "class-validator";
import { applyMiddleware } from 'graphql-middleware';
import {  PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from "graphql";
import { quickStore } from "./redis";
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
      if(!req.payload)return false;
      if(!arrayNotEmpty(roles) || roles.includes(req.payload.role)){
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
    schema,
    context: (ctx) => ({ prisma,ctx,quickStore:quickStore(ctx)})
  });
  await server.start();

  const app = express();
  // var corsOptions = {
  //   credentials: true
  // };
  // app.use(cors(corsOptions));
  app.use('/graphql',jwt({
    requestProperty:'payload',
    secret: process.env.APP_SECRET as string,
    algorithms: ['HS256'],
    credentialsRequired: false
  }));
  server.applyMiddleware({ app });
  app.listen({ port:process.env.PORT||4000 }, ()=>console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))
}

startApolloServer()