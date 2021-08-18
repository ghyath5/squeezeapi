import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";

export type Context = {
    prisma:PrismaClient,
    ctx:ExpressContext
}