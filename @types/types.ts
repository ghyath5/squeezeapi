import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { StoreType } from "../redis";


export type Context = {
    prisma:PrismaClient,
    ctx:ExpressContext,
    quickStore:StoreType
}